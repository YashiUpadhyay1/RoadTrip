import React from "react";
import { Globe, User, LogOut, LogIn, Home as HomeIcon } from "lucide-react";

const Navbar = ({ user, handleLogout, navigate }) => {
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left Section: Logo / Home */}
          <div
            className="flex items-center cursor-pointer hover:opacity-90 transition"
            onClick={() => navigate("home")}
          >
            <Globe className="w-7 h-7 mr-2 text-white" />
            <span className="text-xl font-bold tracking-wide">Trip Planner</span>
          </div>

          {/* Right Section: User Controls */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <button
                  onClick={() => navigate("profile")}
                  className="flex items-center hover:text-indigo-200 transition"
                >
                  <User className="w-5 h-5 mr-1" /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center hover:text-red-200 transition"
                >
                  <LogOut className="w-5 h-5 mr-1" /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("auth")}
                className="flex items-center hover:text-indigo-200 transition"
              >
                <LogIn className="w-5 h-5 mr-1" /> Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
