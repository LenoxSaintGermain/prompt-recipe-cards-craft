import React from 'react';
import { CardContent } from '@/components/ui/card';
import { RecipeCard } from '../RecipeCardEditor';
import { ExternalLink } from 'lucide-react';

interface DocumentLayoutProps {
  card: RecipeCard;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
      {title}
    </h3>
    <div className="pl-4 border-l-2 border-accent/30">
      {children}
    </div>
  </div>
);

const DocumentLayout: React.FC<DocumentLayoutProps> = ({ card }) => {
  return (
    <CardContent className="p-8 space-y-8 bg-background">
      {/* What it does */}
      <Section title="What it does">
        <p className="text-foreground leading-relaxed">{card.whatItDoes}</p>
      </Section>

      {/* Who it's for */}
      <Section title="Who it's for">
        <p className="text-foreground leading-relaxed">{card.whoItsFor}</p>
      </Section>

      {/* How it's done */}
      <Section title="How it's done">
        <ol className="space-y-3">
          {card.steps.filter(step => step.trim()).map((step, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </span>
              <p className="text-foreground leading-relaxed pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Example Prompts */}
      {card.examplePrompts.some(p => p.title || p.prompt) && (
        <Section title="Example Prompts">
          <div className="space-y-4">
            {card.examplePrompts.filter(p => p.title || p.prompt).map((example, index) => (
              <div key={index} className="bg-secondary/30 p-4 rounded-xl">
                {example.title && (
                  <h4 className="font-medium text-foreground mb-2">{example.title}</h4>
                )}
                {example.prompt && (
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-background p-3 rounded-lg border border-border font-mono">
                    {example.prompt}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Example in Action */}
      {card.exampleInAction && (
        <Section title="Example in Action">
          <p className="text-foreground leading-relaxed">{card.exampleInAction}</p>
        </Section>
      )}

      {/* Prompt Template */}
      {card.promptTemplate && (
        <Section title="Prompt Template">
          <pre className="text-sm text-foreground whitespace-pre-wrap bg-secondary/30 p-4 rounded-xl border border-border font-mono">
            {card.promptTemplate}
          </pre>
        </Section>
      )}

      {/* Live Demo Link */}
      {card.perplexityChatLink && (
        <Section title="Live Demo">
          <a 
            href={card.perplexityChatLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors duration-200"
          >
            Open Live Demo
            <ExternalLink className="w-4 h-4" />
          </a>
        </Section>
      )}

      {/* Tips */}
      {card.tips.some(tip => tip.trim()) && (
        <Section title="Tips for Best Results">
          <ul className="space-y-2">
            {card.tips.filter(tip => tip.trim()).map((tip, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-difficulty-beginner rounded-full mt-2" />
                <p className="text-foreground leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </CardContent>
  );
};

export default DocumentLayout;
