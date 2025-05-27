
import React from 'react';
import { Card } from '@/components/ui/card';
import { RecipeCard } from './RecipeCardEditor';
import RecipeCardHeader from './recipe-card/RecipeCardHeader';
import RecipeCardFooter from './recipe-card/RecipeCardFooter';
import RearrangeableSlideLayout from './recipe-card/RearrangeableSlideLayout';
import DocumentLayout from './recipe-card/DocumentLayout';

interface RecipeCardPreviewProps {
  card: RecipeCard;
  isSlideMode?: boolean;
  onExportPDF?: () => void;
  onExportPNG?: () => void;
}

const RecipeCardPreview: React.FC<RecipeCardPreviewProps> = ({ card, isSlideMode = false }) => {
  if (isSlideMode) {
    return (
      <div id="recipe-card-preview" className="w-full max-w-7xl mx-auto p-6 bg-white">
        <Card className="border-2 border-purple-200 shadow-xl">
          <RecipeCardHeader name={card.name} difficulty={card.difficulty} isSlideMode />
          <RearrangeableSlideLayout card={card} />
          <RecipeCardFooter isSlideMode />
        </Card>
      </div>
    );
  }

  return (
    <div id="recipe-card-preview" className="max-w-4xl mx-auto p-8 bg-white">
      <Card className="border-2 border-purple-200 shadow-xl">
        <RecipeCardHeader name={card.name} difficulty={card.difficulty} />
        <DocumentLayout card={card} />
        <RecipeCardFooter />
      </Card>
    </div>
  );
};

export default RecipeCardPreview;
