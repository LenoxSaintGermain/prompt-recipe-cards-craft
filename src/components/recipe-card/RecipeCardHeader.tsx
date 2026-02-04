import React from 'react';

interface RecipeCardHeaderProps {
  name: string;
  difficulty: string;
  isSlideMode?: boolean;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-difficulty-beginner';
    case 'Intermediate': return 'bg-difficulty-intermediate';
    case 'Advanced': return 'bg-difficulty-advanced';
    default: return 'bg-muted-foreground';
  }
};

const RecipeCardHeader: React.FC<RecipeCardHeaderProps> = ({ name, difficulty, isSlideMode = false }) => {
  return (
    <div className="bg-foreground text-background px-8 py-6 rounded-t-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className={`${isSlideMode ? 'text-xs' : 'text-sm'} font-medium text-muted-foreground/80 uppercase tracking-wider mb-1`}>
            AI Pattern
          </p>
          <h1 className={`${isSlideMode ? 'text-xl' : 'text-2xl'} font-semibold leading-tight text-balance`}>
            {name || 'Untitled Pattern'}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`w-2.5 h-2.5 rounded-full ${getDifficultyColor(difficulty)}`} />
          <span className={`${isSlideMode ? 'text-xs' : 'text-sm'} text-muted-foreground/80`}>
            {difficulty}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCardHeader;
