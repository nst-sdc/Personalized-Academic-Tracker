// Enhanced utils.js with better token handling and consistent key naming

export const semesters = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"];
export const gradeOptions = ["A+", "A", "B+", "B", "C+", "C", "D", "F"];

export const gradePoints = {
  "A+": 4.0, "A": 4.0, "B+": 3.5, "B": 3.0,
  "C+": 2.5, "C": 2.0, "D": 1.0, "F": 0.0
};

export const gradeColors = {
  "A+": "text-green-600 bg-green-100 border-green-200",
  "A": "text-green-600 bg-green-100 border-green-200",
  "B+": "text-blue-600 bg-blue-100 border-blue-200",
  "B": "text-blue-600 bg-blue-100 border-blue-200",
  "C+": "text-yellow-600 bg-yellow-100 border-yellow-200",
  "C": "text-yellow-600 bg-yellow-100 border-yellow-200",
  "D": "text-orange-600 bg-orange-100 border-orange-200",
  "F": "text-red-600 bg-red-100 border-red-200"
};

export const gradeDarkColors = {
  "A+": "text-green-400 bg-green-500/10 border-green-500/20",
  "A": "text-green-400 bg-green-500/10 border-green-500/20",
  "B+": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "B": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "C+": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  "C": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  "D": "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "F": "text-red-400 bg-red-500/10 border-red-500/20"
};

// In-memory token storage as fallback
let inMemoryToken = null;

// Use consistent token key naming with api.js
const TOKEN_KEY = 'authToken';

// Enhanced token management with better error handling
export const getAuthToken = () => {
  try {
    // Use the same key as api.js
    const token = localStorage.getItem(TOKEN_KEY) || 
                 sessionStorage.getItem(TOKEN_KEY) || 
                 inMemoryToken;
    
    console.log("Token retrieval:", {
      localStorage: !!localStorage.getItem(TOKEN_KEY),
      sessionStorage: !!sessionStorage.getItem(TOKEN_KEY),
      inMemory: !!inMemoryToken,
      finalToken: !!token
    });
    
    return token;
  } catch (error) {
    console.error("Error accessing storage:", error);
    return inMemoryToken;
  }
};

export const setAuthToken = (token, remember = false) => {
  try {
    // Always store in memory as backup
    inMemoryToken = token;
    
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
    }
    
    console.log("Token stored:", { token: !!token, remember });
  } catch (error) {
    console.error("Error storing token:", error);
    // Fallback to memory storage
    inMemoryToken = token;
  }
};

export const removeAuthToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    inMemoryToken = null;
    console.log("Token removed");
  } catch (error) {
    console.error("Error removing token:", error);
    inMemoryToken = null;
  }
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  
  console.log("Creating auth headers:", { hasToken: !!token });
  
  const headers = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
};

// Check if token is valid (basic structure check)
export const isTokenValid = (token) => {
  if (!token) {
    console.log("Token validation: No token provided");
    return false;
  }
  
  try {
    // Basic JWT structure check (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log("Token validation: Invalid structure");
      return false;
    }
    
    // Decode payload to check expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;
    const isValid = payload.exp > currentTime;
    
    console.log("Token validation:", {
      hasExpiration: !!payload.exp,
      currentTime,
      expiration: payload.exp,
      isValid
    });
    
    return isValid;
  } catch (error) {
    console.error("Token validation error:", error);
    return false;
  }
};

// Enhanced API call with automatic token refresh
export const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    console.error("No authentication token found");
    throw new Error("No authentication token found");
  }
  
  if (!isTokenValid(token)) {
    console.error("Token expired or invalid");
    removeAuthToken();
    throw new Error("Token expired");
  }
  
  console.log("Making authenticated request:", { url, hasToken: !!token });
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    },
    credentials: "include"
  });
  
  if (response.status === 401) {
    console.error("Authentication failed - removing token");
    removeAuthToken();
    throw new Error("Authentication failed");
  }
  
  return response;
};