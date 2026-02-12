import React from "react";
import { Link, useNavigate } from "react-router-dom";
import img from '../assets/mobile.png'

export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-orange-100 via-white to-orange-50 overflow-hidden">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-20 py-5 bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-50">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent tracking-wide">
          Let's Connect
        </h2>

        <div className="hidden md:flex gap-10 items-center text-gray-700 font-semibold">
          <p
            onClick={() => router("/aljk23")}
            className="cursor-pointer relative group transition duration-300"
          >
            Join as Guest
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </p>

          <p
            onClick={() => router("/auth")}
            className="cursor-pointer relative group transition duration-300"
          >
            Register
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full"></span>
          </p>

          <button
            onClick={() => router("/auth")}
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-orange-300 hover:scale-105 transition-all duration-300"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-24 py-16 md:py-28">
        
        {/* Left Content */}
        <div className="md:w-1/2 space-y-8 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-800">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Connect
            </span>{" "}
            Anytime, Anywhere
          </h1>

          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-lg">
            Stay close to the people who matter most. Let's Connect provides 
            secure, fast, and high-quality video calls so distance never feels far.
          </p>

          <Link
            to="/auth"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-2xl shadow-xl hover:shadow-orange-400 hover:scale-105 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center mb-12 md:mb-0">
          <img
            src={img}
            alt="Mobile Preview"
            className="w-80 md:w-[420px] object-contain drop-shadow-[0_25px_50px_rgba(255,152,57,0.35)] hover:scale-105 transition duration-500"
          />
        </div>
      </div>
    </div>
  );
}
