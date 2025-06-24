import React from "react";
import { useNavigate } from "react-router-dom";

const MainHeroPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white border-4 border-blue-400">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 pt-8 pb-4">
        <div className="text-xl font-semibold text-[#1a174d]">The Academic Tracker</div>
        <div className="flex items-center space-x-8">
          <a href="#" className="text-[#8b8ba7] font-medium hover:text-[#1a174d] transition">About</a>
          <a href="#" className="text-[#1a174d] font-semibold underline underline-offset-4">Features</a>
          <a href="#" className="text-[#8b8ba7] font-medium hover:text-[#1a174d] transition">Contacts</a>
          <button
            className="ml-4 px-6 py-2 rounded-full bg-[#4f3ff0] text-white font-semibold shadow hover:bg-[#372bb0] transition"
            onClick={() => navigate("/")}
          >
            Explore
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-8 pb-16">
        {/* Left: Text */}
        <div className="flex-1 max-w-lg ml-60">
          <h1 className="text-5xl font-bold text-[#1a174d] mb-6 leading-tight">
            Great things<br />begin in a<br />small way
          </h1>
          <p className="text-lg text-[#b0b0c3] mb-10">
            Ace your academics with ease. Track your progress, manage your time, and stay on top of your studies.
          </p>
          <div className="flex items-center space-x-6">
            <button className="px-8 py-3 rounded-full bg-[#1de9b6] text-white font-semibold shadow hover:bg-[#13b98a] transition">Get Started</button>
            <a href="#" className="text-[#1a174d] font-semibold hover:underline">Learn More</a>
          </div>
        </div>
        {/* Right: Tablet Image */}
        <div className="flex-1 flex justify-center items-center">
          <div className="w-[400px] h-[500px] bg-black rounded-3xl flex items-center justify-center shadow-lg border-8 border-black">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
              alt="Tablet Mockup"
              className="w-[370px] h-[470px] object-cover rounded-2xl"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainHeroPage;
