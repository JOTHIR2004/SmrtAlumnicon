import React from "react";
import { useNavigate } from "react-router-dom";
import collegeImg from "../assets/college.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen w-full bg-cover bg-center relative font-sans"
      style={{ backgroundImage: `url(${collegeImg})` }}
    >
      {/* ===== NAVBAR ===== */}
      <div className="absolute top-8 left-12 right-12 flex justify-between items-center md:flex-row flex-col md:gap-0 gap-3 md:top-8 md:left-12 md:right-12 top-4 left-4 right-4 bg-white/20 p-4 rounded-2xl">
        <div className="text-[#00ff66] font-BigShInTxt text-4xl ">
          CSBS
        </div>

        <button
          onClick={() => navigate("/login")}
          className="bg-[#00ff66] hover:bg-[#00e65c] transition
                     px-6 py-2 rounded-full font-bold text-black text-sm md:text-base"
        >
          LOGIN
        </button>
      </div>

      {/* ===== RIGHT SIDE LOGIN TEXT ===== */}
      <div
        className="absolute top-32 right-10 text-center text-[#00ff66] font-bold
                   md:top-32 md:right-10
                   static md:absolute mt-32 md:mt-0"
      >
        <span className="text-2xl md:text-[28px]">☝</span>
        <p className="mt-2 leading-tight text-base md:text-lg">
          PLEASE <br /> LOGIN
        </p>
      </div>
    </div>
  );
}

export default Home;
