
import React from 'react';

interface HeaderProps {
    onAddBusinessClick: () => void;
}

// Use a direct URL for the logo for better reliability and performance
const logoUrl = "https://i.ibb.co/L5hB2zL/santichon-logo.jpg";

const Header: React.FC<HeaderProps> = ({ onAddBusinessClick }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Santichon Logo" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-green-800 tracking-wide">เครือข่ายกิจการศิษย์เก่าสันติชน</h1>
              <p className="text-gray-500 text-xs md:text-sm">Santichon Islamic School Alumni Network</p>
            </div>
        </div>
        <button
          onClick={onAddBusinessClick}
          className="bg-green-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-800 transition-colors duration-300 shadow-sm flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">เพิ่มข้อมูล</span>
        </button>
      </div>
    </header>
  );
};

export default Header;