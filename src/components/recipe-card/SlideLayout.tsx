import React from 'react';
import { CardContent } from '@/components/ui/card';
import { RecipeCard } from '../RecipeCardEditor';

interface SlideLayoutProps {
  card: RecipeCard;
}

interface SlideSectionProps {
  title: string;
  children: React.ReactNode;
}

const SlideSection: React.FC<SlideSectionProps> = ({ title, children }) => (
  <div className="bg-secondary/30 rounded-xl p-4 space-y-2">
    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
      {title}
    </h3>
    {children}
  </div>
);

const SlideLayout: React.FC<SlideLayoutProps> = ({ card }) => {
  return (
    <CardContent className="p-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Conceptual Information */}
        <div className="space-y-4">
          {/* What it does */}
          <SlideSection title="What it does">
            <p className="text-sm text-foreground leading-relaxed">{card.whatItDoes}</p>
          </SlideSection>

          {/* Who it's for */}
          <SlideSection title="Who it's for">
            <p className="text-sm text-foreground leading-relaxed">{card.whoItsFor}</p>
          </SlideSection>

          {/* Tips */}
          {card.tips.some(tip => tip.trim()) && (
            <SlideSection title="Tips">
              <ul className="space-y-1.5">
                {card.tips.filter(tip => tip.trim()).map((tip, index) => (
                  <li key={index} className="flex gap-2 text-sm">
                    <span className="flex-shrink-0 w-1.5 h-1.5 bg-difficulty-beginner rounded-full mt-1.5" />
                    <p className="text-foreground leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </SlideSection>
          )}
        </div>

        {/* Right Column - Implementation & Examples */}
        <div className="space-y-4">
          {/* Steps */}
          <SlideSection title="Steps">
            <ol className="space-y-2">
              {card.steps.filter(step => step.trim()).map((step, index) => (
                <li key={index} className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed flex-1">{step}</p>
                </li>
              ))}
            </ol>
          </SlideSection>

          {/* Example Prompts */}
          {card.examplePrompts.some(p => p.title || p.prompt) && (
            <SlideSection title="Example Prompts">
              <div className="space-y-3">
                {card.examplePrompts.filter(p => p.title || p.prompt).map((example, index) => (
                  <div key={index} className="bg-background rounded-lg p-3 border border-border">
                    {example.title && (
                      <h4 className="font-medium text-foreground mb-1 text-sm">
                        {example.title}
                      </h4>
                    )}
                    {example.prompt && (
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                        {example.prompt}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </SlideSection>
          )}

          {/* Example in Action */}
          {card.exampleInAction && (
            <SlideSection title="Example in Action">
              <p className="text-sm text-foreground leading-relaxed">{card.exampleInAction}</p>
            </SlideSection>
          )}

          {/* Prompt Template */}
          {card.promptTemplate && (
            <SlideSection title="Prompt Template">
              <pre className="text-xs text-foreground whitespace-pre-wrap font-mono bg-background p-2 rounded-lg border border-border">
                {card.promptTemplate}
              </pre>
            </SlideSection>
          )}
        </div>
      </div>
    </CardContent>
  );
};

export default SlideLayout;
