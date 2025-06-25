import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { IoIosArrowBack, IoIosArrowForward, IoMdMenu, IoMdClose } from "react-icons/io";

const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // TODO: Replace with your Google OAuth Client ID

const Calendar = ({ darkMode }) => {
  const [user, setUser] = useState(null);

  // This function will be called after successful login
  const handleLoginSuccess = (credentialResponse) => {
    // Decode the credential to get user info (e.g., email)
    const base64Url = credentialResponse.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const userInfo = JSON.parse(jsonPayload);
    setUser(userInfo);
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
  };

  let calendarURL = null;
  if (user && user.email) {
    calendarURL = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(user.email)}&ctz=Asia%2FKolkata`;
  }

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className={`flex h-[calc(100vh-0px)] w-full transition-colors duration-300 ${darkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-8 py-8 relative">
          <div className={`w-full max-w-4xl mx-auto rounded-2xl shadow-xl p-8 ${darkMode ? 'bg-[#18181b]' : 'bg-white'} transition-colors duration-300`}>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                <span role="img" aria-label="calendar">📅</span> Academic Calendar
              </h1>
              {user && (
                <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition">Logout</button>
              )}
            </div>
            {!user ? (
              <div className="flex flex-col items-center justify-center min-h-[350px]">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => alert('Login Failed')}
                  useOneTap
                />
                <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 text-center max-w-md">
                  Login with your Google account to view your personalized academic calendar.
                </p>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <iframe
                  src={calendarURL}
                  style={{ border: 0 }}
                  width="1000"
                  height="600"
                  frameBorder="0"
                  scrolling="no"
                  title="Google Calendar"
                  className="rounded-xl shadow-lg"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Calendar;
