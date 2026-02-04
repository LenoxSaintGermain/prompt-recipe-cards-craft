import React from 'react';
import EnhancedStepsList from './EnhancedStepsList';

interface RecipeCardSectionProps {
  title: string;
  children: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  isSlideMode?: boolean;
  steps?: string[];
}

const RecipeCardSection: React.FC<RecipeCardSectionProps> = ({ 
  title, 
  children, 
  bgColor = 'bg-secondary/30',
  borderColor = 'border-accent/30',
  isSlideMode = false,
  steps
}) => {
  const isStepsSection = title.toLowerCase().includes('how it\'s done') || title.toLowerCase().includes('steps');
  const shouldUseEnhancedSteps = isStepsSection && steps && steps.length > 0;

  if (isSlideMode) {
    return (
      <section className={`${bgColor} p-4 rounded-xl`}>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
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
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div className={`pl-4 border-l-2 ${borderColor}`}>
        {shouldUseEnhancedSteps ? (
          <EnhancedStepsList steps={steps} isSlideMode={isSlideMode} />
        ) : (
          children
        )}
      </div>
    </section>
  );
};

export default RecipeCardSection;
