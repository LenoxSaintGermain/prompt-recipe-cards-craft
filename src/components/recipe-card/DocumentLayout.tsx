
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { RecipeCard } from '../RecipeCardEditor';
import RecipeCardSection from './RecipeCardSection';
import { ExternalLink } from 'lucide-react';

interface DocumentLayoutProps {
  card: RecipeCard;
}

const DocumentLayout: React.FC<DocumentLayoutProps> = ({ card }) => {
  return (
    <CardContent className="p-8 space-y-8 bg-gradient-to-br from-white to-purple-50">
      {/* What it does */}
      <RecipeCardSection title="What it does" bgColor="bg-blue-50" borderColor="border-blue-200">
        <p className="text-gray-700 leading-relaxed">{card.whatItDoes}</p>
      </RecipeCardSection>

      {/* Who it's for */}
      <RecipeCardSection title="Who it's for" bgColor="bg-green-50" borderColor="border-green-200">
        <p className="text-gray-700 leading-relaxed">{card.whoItsFor}</p>
      </RecipeCardSection>

      {/* How it's done - Pass steps for enhanced formatting */}
      <RecipeCardSection 
        title="How it's done" 
        bgColor="bg-purple-50" 
        borderColor="border-purple-200"
        steps={card.steps}
      >
        {/* Fallback content if enhanced steps aren't used */}
        <ol className="list-decimal list-inside space-y-3">
          {card.steps.map((step, index) => (
            <li key={index} className="text-gray-700 leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </RecipeCardSection>

      {/* Example Prompts */}
      <RecipeCardSection title="Example Prompts" bgColor="bg-yellow-50" borderColor="border-yellow-200">
        <div className="space-y-4">
          {card.examplePrompts.map((example, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-gray-800 mb-2">{example.title}</h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded border">
                {example.prompt}
              </pre>
            </div>
          ))}
        </div>
      </RecipeCardSection>

      {/* Example in Action */}
      <RecipeCardSection title="Example in Action" bgColor="bg-indigo-50" borderColor="border-indigo-200">
        <p className="text-gray-700 leading-relaxed">{card.exampleInAction}</p>
      </RecipeCardSection>

      {/* Prompt Template */}
      <RecipeCardSection title="Prompt Template" bgColor="bg-pink-50" borderColor="border-pink-200">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 rounded border border-pink-200">
          {card.promptTemplate}
        </pre>
      </RecipeCardSection>

      {/* Perplexity Chat Link */}
      {card.perplexityChatLink && (
        <RecipeCardSection title="Try it in Perplexity" bgColor="bg-orange-50" borderColor="border-orange-200">
          <a 
            href={card.perplexityChatLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
          >
            Open in Perplexity
            <ExternalLink className="w-4 h-4" />
          </a>
        </RecipeCardSection>
      )}

      {/* Tips */}
      <RecipeCardSection title="Tips for Best Results" bgColor="bg-teal-50" borderColor="border-teal-200">
        <ul className="list-disc list-inside space-y-2">
          {card.tips.map((tip, index) => (
            <li key={index} className="text-gray-700 leading-relaxed">
              {tip}
            </li>
          ))}
        </ul>
      </RecipeCardSection>
    </CardContent>
  );
};

export default DocumentLayout;
