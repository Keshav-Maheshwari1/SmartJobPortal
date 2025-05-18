import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative w-full h-[600px] md:h-[700px] text-gray-100 flex items-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
          alt="Workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10 px-4 md:px-0 ">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Find Your <span className="text-blue-500">Dream Job</span>
          </h1>
          <p className="text-lg text-gray-200 mb-6">
            Unlock opportunities, connect with top employers, and begin the
            journey to your ideal career.
          </p>
          <Link to="/jobs">
            <button className="py-3 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm font-medium tracking-wide">
              Explore Jobs
            </button>
          </Link>
        </div>
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Workspace"
            className="rounded-xl shadow-lg w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
