
import React from 'react';
import EnhancedStepsList from './EnhancedStepsList';

interface RecipeCardSectionProps {
  title: string;
  children: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  isSlideMode?: boolean;
  steps?: string[]; // Add steps prop for enhanced formatting
}

const RecipeCardSection: React.FC<RecipeCardSectionProps> = ({ 
  title, 
  children, 
  bgColor = 'bg-white',
  borderColor = 'border-purple-200',
  isSlideMode = false,
  steps
}) => {
  // Check if this is a steps section and we have steps data
  const isStepsSection = title.toLowerCase().includes('how it\'s done') || title.toLowerCase().includes('steps');
  const shouldUseEnhancedSteps = isStepsSection && steps && steps.length > 0;

  if (isSlideMode) {
    return (
      <section className={`${bgColor} p-3 rounded-lg`}>
        <h3 className={`text-sm font-bold text-gray-800 mb-2 border-b ${borderColor} pb-1`}>
          {title}
        </h3>
        {shouldUseEnhancedSteps ? (
          <EnhancedStepsList steps={steps} isSlideMode={isSlideMode} />
        ) : (
          children
        )}
      </section>
    );
  }

  return (
    <section>
      <h3 className={`text-lg font-bold text-gray-800 mb-3 border-b-2 ${borderColor} pb-1`}>
        {title}
      </h3>
      {shouldUseEnhancedSteps ? (
        <EnhancedStepsList steps={steps} isSlideMode={isSlideMode} />
      ) : (
        children
      )}
    </section>
  );
};

export default RecipeCardSection;
