
import React from 'react';
import { CardContent } from '@/components/ui/card';
import RecipeCardSection from './RecipeCardSection';
import { RecipeCard } from '../RecipeCardEditor';

interface DocumentLayoutProps {
  card: RecipeCard;
}

const DocumentLayout: React.FC<DocumentLayoutProps> = ({ card }) => {
  return (
    <CardContent className="p-6 space-y-6">
      {/* What it does */}
      <RecipeCardSection title="What it does:">
        <p className="text-gray-700 leading-relaxed">{card.whatItDoes}</p>
      </RecipeCardSection>

      {/* Who it's for */}
      <RecipeCardSection title="Who it's for:">
        <p className="text-gray-700 leading-relaxed">{card.whoItsFor}</p>
      </RecipeCardSection>

      {/* Steps */}
      <RecipeCardSection title="How it's done (Steps):">
        <ol className="space-y-3">
          {card.steps.filter(step => step.trim()).map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <p className="text-gray-700 leading-relaxed flex-1">{step}</p>
            </li>
          ))}
        </ol>
      </RecipeCardSection>

      {/* Example Prompts */}
      {card.examplePrompts.some(p => p.title || p.prompt) && (
        <RecipeCardSection title="Example Prompt(s):">
          <div className="space-y-4">
            {card.examplePrompts.filter(p => p.title || p.prompt).map((example, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                {example.title && (
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Example {index + 1}: {example.title}
                  </h4>
                )}
                {example.prompt && (
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border font-mono">
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
        <RecipeCardSection title="Example in Action:">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{card.exampleInAction}</p>
          </div>
        </RecipeCardSection>
      )}

      {/* Prompt Template */}
      {card.promptTemplate && (
        <RecipeCardSection title="Prompt Template:">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {card.promptTemplate}
            </pre>
          </div>
        </RecipeCardSection>
      )}

      {/* Tips */}
      {card.tips.some(tip => tip.trim()) && (
        <RecipeCardSection title="Tips for Best Results:">
          <ul className="space-y-2">
            {card.tips.filter(tip => tip.trim()).map((tip, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full mt-1.5"></span>
                <p className="text-gray-700 leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </RecipeCardSection>
      )}
    </CardContent>
  );
};

export default DocumentLayout;
