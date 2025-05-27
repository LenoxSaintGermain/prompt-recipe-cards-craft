
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from './RecipeCardEditor';

interface RecipeCardPreviewProps {
  card: RecipeCard;
  isSlideMode?: boolean;
  onExportPDF?: () => void;
  onExportPNG?: () => void;
}

const RecipeCardPreview: React.FC<RecipeCardPreviewProps> = ({ card, isSlideMode = false }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (isSlideMode) {
    return (
      <div id="recipe-card-preview" className="w-full max-w-7xl mx-auto p-6 bg-white">
        <Card className="border-2 border-purple-200 shadow-xl">
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-lg font-bold mb-1">Prompt Recipe Card</h1>
                <h2 className="text-2xl font-extrabold leading-tight">{card.name}</h2>
              </div>
              <Badge className={`${getDifficultyColor(card.difficulty)} text-sm font-semibold border`}>
                {card.difficulty}
              </Badge>
            </div>
          </div>

          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* What it does */}
                <section className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-blue-200 pb-1">
                    What it does:
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{card.whatItDoes}</p>
                </section>

                {/* Who it's for */}
                <section className="bg-green-50 p-3 rounded-lg">
                  <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-green-200 pb-1">
                    Who it's for:
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{card.whoItsFor}</p>
                </section>

                {/* Tips */}
                {card.tips.some(tip => tip.trim()) && (
                  <section className="bg-yellow-50 p-3 rounded-lg">
                    <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-yellow-200 pb-1">
                      Tips for Best Results:
                    </h3>
                    <ul className="space-y-1">
                      {card.tips.filter(tip => tip.trim()).map((tip, index) => (
                        <li key={index} className="flex gap-2 text-sm">
                          <span className="flex-shrink-0 w-3 h-3 bg-green-500 rounded-full mt-1"></span>
                          <p className="text-gray-700 leading-relaxed">{tip}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Steps */}
                <section className="bg-purple-50 p-3 rounded-lg">
                  <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-purple-200 pb-1">
                    How it's done (Steps):
                  </h3>
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
                </section>

                {/* Example Prompts */}
                {card.examplePrompts.some(p => p.title || p.prompt) && (
                  <section className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">
                      Example Prompt(s):
                    </h3>
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
                  </section>
                )}

                {/* Example in Action */}
                {card.exampleInAction && (
                  <section className="bg-indigo-50 p-3 rounded-lg">
                    <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-indigo-200 pb-1">
                      Example in Action:
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{card.exampleInAction}</p>
                  </section>
                )}

                {/* Prompt Template */}
                {card.promptTemplate && (
                  <section className="bg-orange-50 p-3 rounded-lg">
                    <h3 className="text-sm font-bold text-gray-800 mb-2 border-b border-orange-200 pb-1">
                      Prompt Template:
                    </h3>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-white p-2 rounded border">
                      {card.promptTemplate}
                    </pre>
                  </section>
                )}
              </div>
            </div>
          </CardContent>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-b-lg border-t">
            <p className="text-center text-xs text-gray-600">
              Perplexity Enterprise Prompt Recipe Card
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Original vertical layout
  return (
    <div id="recipe-card-preview" className="max-w-4xl mx-auto p-8 bg-white">
      <Card className="border-2 border-purple-200 shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">Prompt Recipe Card</h1>
              <h2 className="text-3xl font-extrabold leading-tight">{card.name}</h2>
            </div>
            <Badge className={`${getDifficultyColor(card.difficulty)} text-sm font-semibold border`}>
              {card.difficulty}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* What it does */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-purple-200 pb-1">
              What it does:
            </h3>
            <p className="text-gray-700 leading-relaxed">{card.whatItDoes}</p>
          </section>

          {/* Who it's for */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-purple-200 pb-1">
              Who it's for:
            </h3>
            <p className="text-gray-700 leading-relaxed">{card.whoItsFor}</p>
          </section>

          {/* Steps */}
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-purple-200 pb-1">
              How it's done (Steps):
            </h3>
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
          </section>

          {/* Example Prompts */}
          {card.examplePrompts.some(p => p.title || p.prompt) && (
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-purple-200 pb-1">
                Example Prompt(s):
              </h3>
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
            </section>
          )}

          {/* Example in Action */}
          {card.exampleInAction && (
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-purple-200 pb-1">
                Example in Action:
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{card.exampleInAction}</p>
              </div>
            </section>
          )}

          {/* Prompt Template */}
          {card.promptTemplate && (
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-purple-200 pb-1">
                Prompt Template:
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {card.promptTemplate}
                </pre>
              </div>
            </section>
          )}

          {/* Tips */}
          {card.tips.some(tip => tip.trim()) && (
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-3 border-b-2 border-purple-200 pb-1">
                Tips for Best Results:
              </h3>
              <ul className="space-y-2">
                {card.tips.filter(tip => tip.trim()).map((tip, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-4 h-4 bg-green-500 rounded-full mt-1.5"></span>
                    <p className="text-gray-700 leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </CardContent>

        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-b-lg border-t">
          <p className="text-center text-sm text-gray-600">
            Perplexity Enterprise Prompt Recipe Card
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RecipeCardPreview;
