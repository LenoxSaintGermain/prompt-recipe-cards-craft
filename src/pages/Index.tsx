import React, { useState } from 'react';
import RecipeCardEditor, { RecipeCard } from '@/components/RecipeCardEditor';
import RecipeCardPreview from '@/components/RecipeCardPreview';
import RecipeCardLibrary from '@/components/RecipeCardLibrary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, Presentation, Edit } from 'lucide-react';
import { exportToPNG, exportToPDF } from '@/components/ExportUtils';
import { toast } from 'sonner';
import { useRecipeCards } from '@/hooks/useRecipeCards';

type View = 'library' | 'editor' | 'preview';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('library');
  const [currentCard, setCurrentCard] = useState<RecipeCard | undefined>();
  const [isSlideMode, setIsSlideMode] = useState(false);
  const [previousView, setPreviousView] = useState<View>('library');
  
  const { cards, loading, saveCard, deleteCard } = useRecipeCards();

  const handleSaveCard = async (card: RecipeCard) => {
    const success = await saveCard(card);
    if (success) {
      setCurrentView('library');
      setCurrentCard(undefined);
      setPreviousView('library');
    }
  };

  const handleNewCard = () => {
    setCurrentCard(undefined);
    setCurrentView('editor');
    setPreviousView('library');
  };

  const handleEditCard = (card: RecipeCard) => {
    setCurrentCard(card);
    setCurrentView('editor');
    setPreviousView('library');
  };

  const handleViewCard = (card: RecipeCard) => {
    setCurrentCard(card);
    setPreviousView('library');
    setCurrentView('preview');
  };

  const handleDeleteCard = async (cardId: string) => {
    await deleteCard(cardId);
  };

  const handleExportCard = async (card: RecipeCard, format: 'pdf' | 'png' | 'markdown') => {
    if (format === 'markdown') {
      try {
        const { exportToMarkdown } = await import('@/components/ExportUtils');
        const filename = card.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        exportToMarkdown(card, filename);
        toast.success('Recipe card exported as Markdown!');
      } catch (error) {
        toast.error('Markdown export failed. Please try again.');
        console.error('Markdown export error:', error);
      }
      return;
    }

    const originalView = currentView;
    const originalCard = currentCard;
    const originalPreviousView = previousView;
    
    setCurrentCard(card);
    setPreviousView('library');
    setCurrentView('preview');
    
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
        setCurrentView(originalView);
        setCurrentCard(originalCard);
        setPreviousView(originalPreviousView);
      }
    }, 100);
  };

  const handlePreviewFromEditor = (card: RecipeCard) => {
    setCurrentCard(card);
    setPreviousView('editor');
    setCurrentView('preview');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
    setCurrentCard(undefined);
    setPreviousView('library');
  };

  const handleBackToEditor = () => {
    setCurrentView('editor');
    setPreviousView('library');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      {currentView !== 'library' && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button onClick={handleBackToLibrary} variant="ghost" className="mb-0">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Library
              </Button>
              
              {/* Show Back to Editor button when in preview and came from editor */}
              {currentView === 'preview' && previousView === 'editor' && (
                <Button onClick={handleBackToEditor} variant="outline" className="mb-0">
                  <Edit className="w-4 h-4 mr-2" />
                  Back to Editor
                </Button>
              )}
            </div>
            
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
