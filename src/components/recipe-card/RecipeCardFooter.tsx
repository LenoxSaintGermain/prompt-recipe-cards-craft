import React from 'react';

interface RecipeCardFooterProps {
  isSlideMode?: boolean;
}

const RecipeCardFooter: React.FC<RecipeCardFooterProps> = ({ isSlideMode = false }) => {
  return (
    <div className={`bg-secondary/50 ${isSlideMode ? 'px-4 py-3' : 'px-8 py-4'} rounded-b-xl border-t border-border`}>
      <p className={`text-center ${isSlideMode ? 'text-xs' : 'text-sm'} text-muted-foreground font-medium`}>
        Prompt & Context Engineering Library
      </p>
    </div>
  );
};

export default RecipeCardFooter;
