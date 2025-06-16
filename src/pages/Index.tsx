import React, { useState } from 'react';
import RecipeCardEditor, { RecipeCard } from '@/components/RecipeCardEditor';
import RecipeCardPreview from '@/components/RecipeCardPreview';
import RecipeCardLibrary from '@/components/RecipeCardLibrary';
import ConnectionStatus from '@/components/ConnectionStatus';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, Presentation, Edit, RefreshCw } from 'lucide-react';
import { exportToPNG, exportToPDF } from '@/components/ExportUtils';
import { toast } from 'sonner';
import { useRecipeCards } from '@/hooks/useRecipeCards';

type View = 'library' | 'editor' | 'preview';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('library');
  const [currentCard, setCurrentCard] = useState<RecipeCard | undefined>();
  const [isSlideMode, setIsSlideMode] = useState(false);
  const [previousView, setPreviousView] = useState<View>('library');
  
  const { cards, loading, error, saveCard, bulkSaveCards, deleteCard, reloadCards } = useRecipeCards();

  const handleSaveCard = async (card: RecipeCard) => {
    const success = await saveCard(card);
    if (success) {
      setCurrentView('library');
      setCurrentCard(undefined);
      setPreviousView('library');
    }
  };

  const handleBulkSaveCards = async (cards: RecipeCard[]) => {
    const success = await bulkSaveCards(cards);
    if (success) {
      // Don't change view for bulk saves, let user continue working
      // The success/failure messages are handled in the bulkSaveCards function
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

  const handleRetry = () => {
    reloadCards();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ConnectionStatus />
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe cards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ConnectionStatus />
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L5.098 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleRetry} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ConnectionStatus />
      
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
          onRefresh={reloadCards}
        />
      )}

      {currentView === 'editor' && (
        <RecipeCardEditor
          card={currentCard}
          onSave={handleSaveCard}
          onPreview={handlePreviewFromEditor}
          onBulkSave={handleBulkSaveCards}
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
