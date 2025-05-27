
import React from 'react';

interface RecipeCardFooterProps {
  isSlideMode?: boolean;
}

const RecipeCardFooter: React.FC<RecipeCardFooterProps> = ({ isSlideMode = false }) => {
  return (
    <div className={`bg-gradient-to-r from-gray-50 to-gray-100 ${isSlideMode ? 'p-3' : 'p-4'} rounded-b-lg border-t`}>
      <p className={`text-center ${isSlideMode ? 'text-xs' : 'text-sm'} text-gray-600`}>
        Perplexity Enterprise Prompt Recipe Card
      </p>
    </div>
  );
};

export default RecipeCardFooter;
