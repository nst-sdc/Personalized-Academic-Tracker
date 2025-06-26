import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup/signup.jsx";
import Signin from "./pages/Signin/signin.jsx";
import HomePageLayout from "./pages/Homepage/HomePageLayout.jsx";
import MainHeroPage from "./pages/Hero/hero.jsx";
import EmailVerified from "./pages/Signup/EmailVerified.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/hero" element={<MainHeroPage darkMode={darkMode} />} />
        <Route
          path="/*"
          element={<HomePageLayout darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/email-verified/:token" element={<EmailVerified />} />
      </Routes>
    </Router>
  );
}

export default App;


