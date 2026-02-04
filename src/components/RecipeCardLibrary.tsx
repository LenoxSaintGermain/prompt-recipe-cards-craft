import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RecipeCard } from './RecipeCardEditor';
import { useCollections } from '@/hooks/useCollections';
import BulkManagement from './BulkManagement';
import BulkActionToolbar from './BulkActionToolbar';
import CollectionDetailView from './CollectionDetailView';
import CollectionQuickActions from './CollectionQuickActions';
import CollectionStats from './CollectionStats';
import { Plus, Edit, Eye, Trash2, Download, Search, FileText, FolderOpen, Filter, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface RecipeCardLibraryProps {
  cards: RecipeCard[];
  onNewCard: () => void;
  onEditCard: (card: RecipeCard) => void;
  onViewCard: (card: RecipeCard) => void;
  onDeleteCard: (cardId: string) => void;
  onExportCard: (card: RecipeCard, format: 'pdf' | 'png' | 'markdown') => void;
  onRefresh?: () => void;
}

const RecipeCardLibrary: React.FC<RecipeCardLibraryProps> = ({
  cards,
  onNewCard,
  onEditCard,
  onViewCard,
  onDeleteCard,
  onExportCard,
  onRefresh = () => {}
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState(cards);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [showBulkManagement, setShowBulkManagement] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [viewingCollection, setViewingCollection] = useState<string | null>(null);
  const [cardCollectionMap, setCardCollectionMap] = useState<Record<string, string[]>>({});
  
  const { collections, getCollectionCards, addCardsToCollection, removeCardsFromCollection, reloadCollections } = useCollections();

  useEffect(() => {
    loadCardCollections();
  }, [cards, collections]);

  useEffect(() => {
    filterCards();
  }, [cards, searchTerm, selectedCollection, cardCollectionMap]);

  const loadCardCollections = async () => {
    const collectionMap: Record<string, string[]> = {};
    
    for (const card of cards) {
      const cardCollections = collections.filter(collection => 
        cardCollectionMap[card.id]?.includes(collection.id)
      );
      collectionMap[card.id] = cardCollections.map(c => c.name);
    }
    
    for (const collection of collections) {
      const collectionCards = await getCollectionCards(collection.id);
      collectionCards.forEach(card => {
        if (!collectionMap[card.id]) {
          collectionMap[card.id] = [];
        }
        if (!collectionMap[card.id].includes(collection.name)) {
          collectionMap[card.id].push(collection.name);
        }
      });
    }
    
    setCardCollectionMap(collectionMap);
  };

  const filterCards = async () => {
    let filtered = cards;

    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.whatItDoes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.whoItsFor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCollection !== 'all') {
      const collection = collections.find(c => c.id === selectedCollection);
      if (collection) {
        const collectionCards = await getCollectionCards(selectedCollection);
        const collectionCardIds = collectionCards.map(c => c.id);
        filtered = filtered.filter(card => collectionCardIds.includes(card.id));
      }
    }

    setFilteredCards(filtered);
  };

  const handleAssignToCollection = async (collectionId: string) => {
    const success = await addCardsToCollection(collectionId, selectedCardIds);
    if (success) {
      setSelectedCardIds([]);
      await loadCardCollections();
      onRefresh();
    }
  };

  const handleRemoveFromCollection = async (collectionId: string) => {
    const success = await removeCardsFromCollection(collectionId, selectedCardIds);
    if (success) {
      setSelectedCardIds([]);
      await loadCardCollections();
      onRefresh();
    }
  };

  const handleDeleteSelectedCards = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedCardIds.length} patterns? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      for (const cardId of selectedCardIds) {
        await onDeleteCard(cardId);
      }
      setSelectedCardIds([]);
      toast.success(`${selectedCardIds.length} patterns deleted successfully!`);
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete some patterns. Please try again.');
    }
  };

  const getDifficultyDot = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-difficulty-beginner';
      case 'Intermediate': return 'bg-difficulty-intermediate';
      case 'Advanced': return 'bg-difficulty-advanced';
      default: return 'bg-muted-foreground';
    }
  };

  const handleSelectCard = (cardId: string, checked: boolean) => {
    if (checked) {
      setSelectedCardIds(prev => [...prev, cardId]);
    } else {
      setSelectedCardIds(prev => prev.filter(id => id !== cardId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCardIds(filteredCards.map(card => card.id));
    } else {
      setSelectedCardIds([]);
    }
  };

  const handleViewCollection = (collectionId: string) => {
    setViewingCollection(collectionId);
  };

  const handleRefreshAll = () => {
    reloadCollections();
    onRefresh();
  };

  if (viewingCollection) {
    const collection = collections.find(c => c.id === viewingCollection);
    if (collection) {
      return (
        <CollectionDetailView
          collection={collection}
          onClose={() => setViewingCollection(null)}
          onViewCard={onViewCard}
          onEditCard={onEditCard}
          onExportCard={onExportCard}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="animate-fade-up">
              <h1 className="text-4xl font-semibold text-foreground tracking-tight">
                Pattern Library
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Discover how experts leverage AI through proven prompt patterns
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowBulkManagement(!showBulkManagement)}
                variant="outline"
                className="rounded-xl press-effect"
              >
                Advanced Tools
              </Button>
              <Button 
                onClick={onNewCard} 
                className="rounded-xl bg-foreground text-background hover:bg-foreground/90 press-effect"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Pattern
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Actions */}
        <section className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <CollectionQuickActions onRefresh={handleRefreshAll} />
        </section>

        {/* Stats */}
        <section className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <CollectionStats 
            collections={collections}
            totalCards={cards.length}
            selectedCollection={selectedCollection}
          />
        </section>

        {/* Bulk Management */}
        {showBulkManagement && (
          <section className="animate-scale-in">
            <BulkManagement
              cards={cards}
              selectedCardIds={selectedCardIds}
              onSelectionChange={setSelectedCardIds}
              onRefresh={onRefresh}
            />
          </section>
        )}

        {/* Search and Filters */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patterns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-11 bg-secondary/50 border-0 rounded-xl focus:bg-background focus:ring-2 focus:ring-accent/20 transition-all duration-200"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="h-12 pl-11 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-accent/20">
                <SelectValue placeholder="Filter by collection..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-2">
                    All Patterns
                    <Badge variant="secondary" className="rounded-full text-xs">{cards.length}</Badge>
                  </span>
                </SelectItem>
                {collections.map(collection => (
                  <SelectItem key={collection.id} value={collection.id}>
                    <span className="flex items-center gap-2">
                      {collection.name}
                      <Badge variant="secondary" className="rounded-full text-xs">{collection.card_count || 0}</Badge>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Collections Overview */}
        {collections.length > 0 && (
          <section className="animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Collections</h2>
              <Button onClick={handleRefreshAll} variant="ghost" size="sm" className="rounded-xl press-effect">
                <RotateCcw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collections.map(collection => (
                <Card 
                  key={collection.id} 
                  className="group border border-border rounded-2xl hover-lift cursor-pointer bg-card"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-accent" />
                        <span className="font-medium text-foreground">{collection.name}</span>
                      </div>
                      <Badge variant="secondary" className="rounded-full text-xs">
                        {collection.card_count || 0}
                      </Badge>
                    </div>
                    {collection.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedCollection(collection.id)}
                        variant="ghost"
                        size="sm"
                        className="flex-1 rounded-xl text-accent hover:bg-accent/10 press-effect"
                      >
                        Filter
                      </Button>
                      <Button
                        onClick={() => handleViewCollection(collection.id)}
                        variant="ghost"
                        size="sm"
                        className="flex-1 rounded-xl press-effect"
                      >
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Card className="border border-border rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-semibold text-foreground">{cards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-difficulty-beginner/10 rounded-xl flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-difficulty-beginner" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Beginner</p>
                  <p className="text-2xl font-semibold text-foreground">{cards.filter(c => c.difficulty === 'Beginner').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-difficulty-intermediate/10 rounded-xl flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-difficulty-intermediate" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Intermediate</p>
                  <p className="text-2xl font-semibold text-foreground">{cards.filter(c => c.difficulty === 'Intermediate').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-difficulty-advanced/10 rounded-xl flex items-center justify-center">
                  <span className="w-3 h-3 rounded-full bg-difficulty-advanced" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Advanced</p>
                  <p className="text-2xl font-semibold text-foreground">{cards.filter(c => c.difficulty === 'Advanced').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bulk Selection */}
        {filteredCards.length > 0 && (
          <section className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl animate-fade-up" style={{ animationDelay: '0.35s' }}>
            <div className="flex items-center gap-3">
              <Checkbox
                id="select-all"
                checked={selectedCardIds.length === filteredCards.length && filteredCards.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium text-foreground cursor-pointer">
                Select All ({filteredCards.length})
              </label>
            </div>
            
            {selectedCardIds.length > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {selectedCardIds.length} selected
              </Badge>
            )}
          </section>
        )}

        {/* Cards Grid */}
        {filteredCards.length === 0 ? (
          <Card className="border-2 border-dashed border-border rounded-2xl animate-fade-up">
            <CardContent className="p-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {cards.length === 0 ? 'No patterns yet' : 'No patterns match your search'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {cards.length === 0 
                  ? 'Create your first pattern to get started.'
                  : 'Try adjusting your search terms or collection filter.'
                }
              </p>
              {cards.length === 0 && (
                <Button onClick={onNewCard} className="rounded-xl press-effect">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Pattern
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {filteredCards.map((card, index) => (
              <Card 
                key={card.id} 
                className="group border border-border rounded-2xl hover-lift bg-card overflow-hidden"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <Checkbox
                        checked={selectedCardIds.includes(card.id)}
                        onCheckedChange={(checked) => handleSelectCard(card.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors duration-200">
                            {card.name}
                          </h3>
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1.5 ${getDifficultyDot(card.difficulty)}`} />
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {card.whatItDoes}
                        </p>
                      </div>
                    </div>
                    
                    {/* Collection tags */}
                    {cardCollectionMap[card.id]?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3 ml-7">
                        {cardCollectionMap[card.id].slice(0, 2).map((collName, i) => (
                          <Badge key={i} variant="secondary" className="text-xs rounded-full">
                            {collName}
                          </Badge>
                        ))}
                        {cardCollectionMap[card.id].length > 2 && (
                          <Badge variant="secondary" className="text-xs rounded-full">
                            +{cardCollectionMap[card.id].length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {card.whoItsFor}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        onClick={() => onViewCard(card)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg press-effect"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onEditCard(card)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg press-effect"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onExportCard(card, 'pdf')}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg press-effect"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onDeleteCard(card.id)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive press-effect"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default RecipeCardLibrary;
