
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RecipeCardHeaderProps {
  name: string;
  difficulty: string;
  isSlideMode?: boolean;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const RecipeCardHeader: React.FC<RecipeCardHeaderProps> = ({ name, difficulty, isSlideMode = false }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className={`${isSlideMode ? 'text-lg' : 'text-2xl'} font-bold mb-2`}>
            Prompt Recipe Card
          </h1>
          <h2 className={`${isSlideMode ? 'text-2xl' : 'text-3xl'} font-extrabold leading-tight`}>
            {name}
          </h2>
        </div>
        <Badge className={`${getDifficultyColor(difficulty)} text-sm font-semibold border`}>
          {difficulty}
        </Badge>
      </div>
    </div>
  );
};

export default RecipeCardHeader;
