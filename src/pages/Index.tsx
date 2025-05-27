import React, { useState, useEffect } from 'react';
import RecipeCardEditor, { RecipeCard } from '@/components/RecipeCardEditor';
import RecipeCardPreview from '@/components/RecipeCardPreview';
import RecipeCardLibrary from '@/components/RecipeCardLibrary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, Presentation } from 'lucide-react';
import { exportToPNG, exportToPDF } from '@/components/ExportUtils';
import { toast } from 'sonner';

type View = 'library' | 'editor' | 'preview';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('library');
  const [cards, setCards] = useState<RecipeCard[]>([]);
  const [currentCard, setCurrentCard] = useState<RecipeCard | undefined>();
  const [isSlideMode, setIsSlideMode] = useState(false);

  // Load cards from localStorage on mount
  useEffect(() => {
    const savedCards = localStorage.getItem('recipeCards');
    if (savedCards) {
      try {
        setCards(JSON.parse(savedCards));
      } catch (error) {
        console.error('Error loading saved cards:', error);
      }
    } else {
      // Initialize with the sample card from your data
      const sampleCard: RecipeCard = {
        id: '1',
        name: 'Generate a Client Intelligence Brief',
        whatItDoes: 'Creates a comprehensive pre-meeting brief by synthesizing information about a client from multiple sources into a structured document with company background, recent developments, and potential discussion points.',
        whoItsFor: 'Account Managers, Sales Team, Client-facing roles preparing for meetings.',
        difficulty: 'Intermediate',
        steps: [
          'Open Perplexity Enterprise and ensure you have access to your connected data sources (if any).',
          'Gather the client name, company name, and any specific topics or questions you want to address in the meeting.',
          'Use the example prompt below, customizing the bracketed sections for your specific client and meeting context.',
          'Review the generated brief and use follow-up prompts to dive deeper into specific areas of interest.',
          'Save the conversation to a relevant Collection for easy access before the meeting.'
        ],
        examplePrompts: [
          {
            title: 'For a comprehensive client brief',
            prompt: `Create a comprehensive client intelligence brief for [CLIENT COMPANY NAME]. Please provide:

1. Company Overview:
   - Basic company information (size, industry, headquarters)
   - Business model and key revenue streams
   - Recent financial performance or funding news

2. Recent Developments:
   - Major announcements from the past 6 months
   - New product launches or service offerings
   - Leadership changes or strategic shifts

3. Industry Context:
   - Current industry trends affecting this company
   - Key competitors and market position
   - Regulatory or market challenges

4. Potential Discussion Points:
   - Relevant pain points or opportunities we could address
   - Questions to ask based on recent developments
   - Ways our services could align with their current priorities

Please focus on information from the last 12 months and include sources where possible.`
          }
        ],
        exampleInAction: 'This prompt works well for mid-market companies where public information is available. The AI will synthesize recent news, company updates, and industry trends into a structured brief perfect for pre-meeting preparation.',
        promptTemplate: `Create a comprehensive client intelligence brief for [CLIENT COMPANY NAME]. Please provide:

1. Company Overview:
   - Basic company information (size, industry, headquarters)
   - Business model and key revenue streams
   - Recent financial performance or funding news

2. Recent Developments:
   - Major announcements from the past [TIME PERIOD]
   - New product launches or service offerings
   - Leadership changes or strategic shifts

3. Industry Context:
   - Current industry trends affecting this company
   - Key competitors and market position
   - Regulatory or market challenges

4. Potential Discussion Points:
   - Relevant pain points or opportunities we could address
   - Questions to ask based on recent developments
   - Ways our [YOUR SERVICES] could align with their current priorities

Please focus on information from the last [TIME PERIOD] and include sources where possible.`,
        tips: [
          'Be specific about the time frame - "last 6 months" works better than "recent".',
          'If the client is a smaller company with limited public information, focus the prompt on industry trends and ask for general insights.',
          'Use follow-up prompts to dive deeper: "What are the top 3 strategic questions I should ask in this meeting?"',
          'Save successful briefs to build a template library for different client types.'
        ]
      };
      setCards([sampleCard]);
    }
  }, []);

  // Save cards to localStorage whenever cards change
  useEffect(() => {
    localStorage.setItem('recipeCards', JSON.stringify(cards));
  }, [cards]);

  const handleSaveCard = (card: RecipeCard) => {
    if (card.id && cards.find(c => c.id === card.id)) {
      // Update existing card
      setCards(prev => prev.map(c => c.id === card.id ? card : c));
      toast.success('Recipe card updated successfully!');
    } else {
      // Add new card
      const newCard = { ...card, id: Date.now().toString() };
      setCards(prev => [...prev, newCard]);
      toast.success('Recipe card created successfully!');
    }
    setCurrentView('library');
    setCurrentCard(undefined);
  };

  const handleNewCard = () => {
    setCurrentCard(undefined);
    setCurrentView('editor');
  };

  const handleEditCard = (card: RecipeCard) => {
    setCurrentCard(card);
    setCurrentView('editor');
  };

  const handleViewCard = (card: RecipeCard) => {
    setCurrentCard(card);
    setCurrentView('preview');
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
    toast.success('Recipe card deleted successfully!');
  };

  const handleExportCard = async (card: RecipeCard, format: 'pdf' | 'png') => {
    // Temporarily switch to preview view for export
    const originalView = currentView;
    const originalCard = currentCard;
    
    setCurrentCard(card);
    setCurrentView('preview');
    
    // Wait for view to update
    setTimeout(async () => {
      try {
        const filename = card.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        if (format === 'pdf') {
          await exportToPDF('recipe-card-preview', filename, isSlideMode);
          toast.success(`Recipe card exported as ${isSlideMode ? 'landscape ' : ''}PDF!`);
        } else {
          await exportToPNG('recipe-card-preview', filename, isSlideMode);
          toast.success(`Recipe card exported as ${isSlideMode ? 'slide-optimized ' : ''}PNG!`);
        }
      } catch (error) {
        toast.error('Export failed. Please try again.');
        console.error('Export error:', error);
      } finally {
        // Restore original view
        setCurrentView(originalView);
        setCurrentCard(originalCard);
      }
    }, 100);
  };

  const handlePreviewFromEditor = (card: RecipeCard) => {
    setCurrentCard(card);
    setCurrentView('preview');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setCurrentCard(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      {currentView !== 'library' && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <Button onClick={handleBackToLibrary} variant="ghost" className="mb-0">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>
            
            {/* Layout Mode Toggle - only show in preview */}
            {currentView === 'preview' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Layout:</span>
                <Button
                  onClick={() => setIsSlideMode(false)}
                  variant={!isSlideMode ? "default" : "outline"}
                  size="sm"
                  className="px-3"
                >
                  <Monitor className="w-4 h-4 mr-1" />
                  Document
                </Button>
                <Button
                  onClick={() => setIsSlideMode(true)}
                  variant={isSlideMode ? "default" : "outline"}
                  size="sm"
                  className="px-3"
                >
                  <Presentation className="w-4 h-4 mr-1" />
                  Slide
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {currentView === 'library' && (
        <RecipeCardLibrary
          cards={cards}
          onNewCard={handleNewCard}
          onEditCard={handleEditCard}
          onViewCard={handleViewCard}
          onDeleteCard={handleDeleteCard}
          onExportCard={handleExportCard}
        />
      )}

      {currentView === 'editor' && (
        <RecipeCardEditor
          card={currentCard}
          onSave={handleSaveCard}
          onPreview={handlePreviewFromEditor}
        />
      )}

      {currentView === 'preview' && currentCard && (
        <div className="py-6">
          <RecipeCardPreview card={currentCard} isSlideMode={isSlideMode} />
          <div className={`${isSlideMode ? 'max-w-7xl' : 'max-w-4xl'} mx-auto px-8 mt-6 flex gap-4`}>
            <Button 
              onClick={() => exportToPDF('recipe-card-preview', currentCard.name.replace(/[^a-z0-9]/gi, '_').toLowerCase(), isSlideMode)}
              className="bg-red-600 hover:bg-red-700"
            >
              Export as {isSlideMode ? 'Landscape ' : ''}PDF
            </Button>
            <Button 
              onClick={() => exportToPNG('recipe-card-preview', currentCard.name.replace(/[^a-z0-9]/gi, '_').toLowerCase(), isSlideMode)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Export as {isSlideMode ? 'Slide ' : ''}PNG
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
