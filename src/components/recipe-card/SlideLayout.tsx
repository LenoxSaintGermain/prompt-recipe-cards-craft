
import React from 'react';
import { CardContent } from '@/components/ui/card';
import RecipeCardSection from './RecipeCardSection';
import { RecipeCard } from '../RecipeCardEditor';

interface SlideLayoutProps {
  card: RecipeCard;
}

const SlideLayout: React.FC<SlideLayoutProps> = ({ card }) => {
  return (
    <CardContent className="p-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Conceptual Information */}
        <div className="space-y-4">
          {/* What it does */}
          <RecipeCardSection title="What it does:" bgColor="bg-blue-50" borderColor="border-blue-200" isSlideMode>
            <p className="text-sm text-gray-700 leading-relaxed">{card.whatItDoes}</p>
          </RecipeCardSection>

          {/* Who it's for */}
          <RecipeCardSection title="Who it's for:" bgColor="bg-green-50" borderColor="border-green-200" isSlideMode>
            <p className="text-sm text-gray-700 leading-relaxed">{card.whoItsFor}</p>
          </RecipeCardSection>

          {/* Tips */}
          {card.tips.some(tip => tip.trim()) && (
            <RecipeCardSection title="Tips for Best Results:" bgColor="bg-yellow-50" borderColor="border-yellow-200" isSlideMode>
              <ul className="space-y-1">
                {card.tips.filter(tip => tip.trim()).map((tip, index) => (
                  <li key={index} className="flex gap-2 text-sm">
                    <span className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-1"></span>
                    <p className="text-gray-700 leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </RecipeCardSection>
          )}
        </div>

        {/* Right Column - Implementation & Examples */}
        <div className="space-y-4">
          {/* Steps */}
          <RecipeCardSection title="How it's done (Steps):" bgColor="bg-purple-50" borderColor="border-purple-200" isSlideMode>
            <ol className="space-y-2">
              {card.steps.filter(step => step.trim()).map((step, index) => (
                <li key={index} className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed flex-1">{step}</p>
                </li>
              ))}
            </ol>
          </RecipeCardSection>

          {/* Example Prompts */}
          {card.examplePrompts.some(p => p.title || p.prompt) && (
            <RecipeCardSection title="Example Prompt(s):" bgColor="bg-gray-50" borderColor="border-gray-200" isSlideMode>
              <div className="space-y-3">
                {card.examplePrompts.filter(p => p.title || p.prompt).map((example, index) => (
                  <div key={index} className="bg-white rounded p-3 border border-gray-200">
                    {example.title && (
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                        Example {index + 1}: {example.title}
                      </h4>
                    )}
                    {example.prompt && (
                      <pre className="text-xs text-gray-700 whitespace-pre-wrap bg-gray-50 p-2 rounded border font-mono">
                        {example.prompt}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </RecipeCardSection>
          )}

          {/* Example in Action */}
          {card.exampleInAction && (
            <RecipeCardSection title="Example in Action:" bgColor="bg-indigo-50" borderColor="border-indigo-200" isSlideMode>
              <p className="text-sm text-gray-700 leading-relaxed">{card.exampleInAction}</p>
            </RecipeCardSection>
          )}

          {/* Prompt Template */}
          {card.promptTemplate && (
            <RecipeCardSection title="Prompt Template:" bgColor="bg-orange-50" borderColor="border-orange-200" isSlideMode>
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-white p-2 rounded border">
                {card.promptTemplate}
              </pre>
            </RecipeCardSection>
          )}
        </div>
      </div>
    </CardContent>
  );
};

export default SlideLayout;
