
import React from 'react';

interface RecipeCardSectionProps {
  title: string;
  children: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  isSlideMode?: boolean;
}

const RecipeCardSection: React.FC<RecipeCardSectionProps> = ({ 
  title, 
  children, 
  bgColor = 'bg-white',
  borderColor = 'border-purple-200',
  isSlideMode = false 
}) => {
  if (isSlideMode) {
    return (
      <section className={`${bgColor} p-3 rounded-lg`}>
        <h3 className={`text-sm font-bold text-gray-800 mb-2 border-b ${borderColor} pb-1`}>
          {title}
        </h3>
        {children}
      </section>
    );
  }

  return (
    <section>
      <h3 className={`text-lg font-bold text-gray-800 mb-3 border-b-2 ${borderColor} pb-1`}>
        {title}
      </h3>
      {children}
    </section>
  );
};

export default RecipeCardSection;
