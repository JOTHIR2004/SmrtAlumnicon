import React from "react";
import { useNavigate } from "react-router-dom";
import collegeImg from "../assets/college.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen w-full bg-cover bg-center font-sans p-5 flex
             justify-center items-center
             sm:items-start sm:justify-center"
      style={{ backgroundImage: `url(${collegeImg})` }}
    >
      <div className="bg-white/90 sm:bg-white/25 flex flex-col justify-around items-center text-center
                  sm:flex-row sm:justify-between sm:items-center
                  gap-4 sm:gap-0
                  w-full max-w-5xl
                  p-5 rounded-2xl">

        {/* CSBS */}
        <div className="text-[#0d9945] sm:text-[#00ff66] 
                    font-BigShInTxt 
                    text-3xl text-6xl sm:text-4xl">
          CSBS
        </div>

        {/* Title */}
        <div className="text-[#0d9945] 
                    font-BigShInTxt
                    text-2xl sm:text-3xl">
          SMART ALUMNI CONNECT
        </div>

        {/* Login Button */}
        <button
          onClick={() => navigate("/login")}
          className="bg-[#00ff66] hover:bg-[#00e65c] transition
               px-6 py-2 rounded-full font-bold text-black
               text-sm sm:text-base w-full sm:w-auto"
        >
          LOGIN
        </button>


      {/* ===== RIGHT SIDE LOGIN TEXT ===== */}
      {/* <div
        className="absolute top-32 right-10 text-center text-[#00ff66] font-bold
                   md:top-32 md:right-10
                   static md:absolute mt-32 md:mt-0"
      >
        <span className="text-2xl md:text-[28px]">☝</span>
        <p className="mt-2 leading-tight text-base md:text-lg">
          PLEASE <br /> LOGIN
        </p>
      </div> */}
    </div>
  );
}

export default Home;
