import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Play, Star, Users, TrendingUp, Sun, Moon } from "lucide-react";

const MainHeroPage = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  
  return (
    <div className={`min-h-screen transition-all duration-700 ${
      darkMode 
        ? "bg-gray-900 text-white" 
        : "bg-white text-gray-900"
    }`}>
      {/* Navigation */}
      <nav className={`relative z-10 border-b transition-all duration-300 ${
        darkMode 
          ? "bg-gray-900 border-gray-800" 
          : "bg-white border-gray-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold">Academic Tracker</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`font-medium transition-colors ${
                darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}>
                Features
              </a>
              <a href="#about" className={`font-medium transition-colors ${
                darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}>
                About
              </a>
              <a href="#contact" className={`font-medium transition-colors ${
                darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
              }`}>
                Contact
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? "bg-gray-800 hover:bg-gray-700 text-yellow-400" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <Star className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Trusted by 10,000+ students
                  </span>
                </div>
                
                <h1 className={`text-5xl lg:text-6xl font-bold leading-tight ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  Academic
                  <span className="block text-blue-600">
                    Scheduling
                  </span>
                  <span className="block">Made Simple</span>
                </h1>
                
                <p className={`text-xl leading-relaxed ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}>
                  The modern way to organize your academic life. Schedule classes, track assignments, and never miss a deadline.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Start Scheduling</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                
                <button className={`px-8 py-3 font-semibold rounded-lg border transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  darkMode 
                    ? "border-gray-600 text-white hover:bg-gray-800" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}>
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    98%
                  </div>
                  <div className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Success Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    24/7
                  </div>
                  <div className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Support
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    10K+
                  </div>
                  <div className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Students
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Dashboard Preview */}
            <div className="relative">
              <div className={`rounded-2xl p-8 border shadow-lg ${
                darkMode 
                  ? "bg-gray-800 border-gray-700" 
                  : "bg-white border-gray-200"
              }`}>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}>
                      Today's Schedule
                    </h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: "Advanced Mathematics", time: "9:00 AM - 10:30 AM", color: "blue" },
                      { title: "Physics Lab", time: "2:00 PM - 4:00 PM", color: "green" },
                      { title: "Study Group", time: "7:00 PM - 9:00 PM", color: "purple" }
                    ].map((event, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border ${
                          darkMode 
                            ? "bg-gray-700 border-gray-600" 
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`font-semibold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}>
                              {event.title}
                            </h4>
                            <p className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}>
                              {event.time}
                            </p>
                          </div>
                          <div className={`w-3 h-3 rounded-full bg-${event.color}-500`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Progress Today
                      </span>
                      <span className={`text-sm font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}>
                        75%
                      </span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainHeroPage;