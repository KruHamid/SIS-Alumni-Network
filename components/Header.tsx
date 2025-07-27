
import React from 'react';

interface HeaderProps {
    onAddBusinessClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddBusinessClick }) => {
  return (
    <header className="bg-green-800 shadow-lg text-white">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide">เครือข่ายกิจการศิษย์เก่าสันติชน</h1>
            <p className="text-green-200 text-sm">Santichon Islamic School Alumni Network</p>
        </div>
        <button
          onClick={onAddBusinessClick}
          className="bg-white text-green-800 font-bold py-2 px-4 rounded-lg hover:bg-green-100 transition-colors duration-300 shadow-md"
        >
          + เพิ่มข้อมูล
        </button>
      </div>
    </header>
  );
};

export default Header;
