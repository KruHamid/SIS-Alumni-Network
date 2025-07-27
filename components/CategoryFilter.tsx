
import React from 'react';
import { BusinessCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, onSelectCategory }) => {
  const categories = ["ทั้งหมด", ...Object.values(BusinessCategory)];

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => {
          const isAllButton = category === "ทั้งหมด";
          const isSelected = (isAllButton && selectedCategory === null) || selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(isAllButton ? null : category)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                isSelected
                  ? 'bg-green-700 text-white shadow'
                  : 'bg-white text-gray-700 hover:bg-green-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
