import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup/signup.jsx";
import Signin from "./pages/Signin/signin.jsx";
import Sidebar from "./pages/Homepage/Sidebar.jsx";
import TopNavbar from "./pages/Homepage/TopNavbar.jsx";
import LeftDateColoumn from "./pages/Homepage/LeftDateColoumn.jsx";
import MainTimeline from "./pages/Homepage/MainTimeLine.jsx";

function HomePageLayout({ darkMode, setDarkMode }) {
  const bgClass = darkMode ? "bg-black text-white" : "bg-white text-black";

  return (
    <div className={`flex h-screen w-full transition-colors duration-300 ${bgClass}`}>
      <Sidebar darkMode={darkMode} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex flex-row w-full h-[calc(100vh-118px)]">
          <LeftDateColoumn darkMode={darkMode} />
          <MainTimeline darkMode={darkMode} />
        </main>
      </div>
    </div>
  );
}

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
        <Route
          path="/"
          element={<HomePageLayout darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App;
