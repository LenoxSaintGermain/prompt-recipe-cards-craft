import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Edit, Eye, Trash2, Download, Search, FileText, FolderOpen, Filter } from 'lucide-react';
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
    
    // Load actual collection memberships from database
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

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.whatItDoes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.whoItsFor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by collection
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
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedCardIds.length} cards? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      for (const cardId of selectedCardIds) {
        await onDeleteCard(cardId);
      }
      setSelectedCardIds([]);
      toast.success(`${selectedCardIds.length} cards deleted successfully!`);
      onRefresh();
    } catch (error) {
      toast.error('Failed to delete some cards. Please try again.');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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

  // If viewing a collection, show the collection detail view
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recipe Card Library</h1>
            <p className="text-purple-100">Manage your Perplexity Enterprise prompt recipes</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowBulkManagement(!showBulkManagement)}
              variant={showBulkManagement ? "secondary" : "outline"}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Advanced Bulk Tools
            </Button>
            <Button onClick={onNewCard} className="bg-white text-purple-600 hover:bg-gray-100">
              <Plus className="w-4 h-4 mr-2" />
              New Recipe Card
            </Button>
          </div>
        </div>
      </div>

      {/* Collection Quick Actions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Quick Collection Actions</h2>
        </div>
        <CollectionQuickActions onRefresh={handleRefreshAll} />
      </div>

      {/* Collection Stats */}
      <div className="mb-6">
        <CollectionStats 
          collections={collections}
          totalCards={cards.length}
          selectedCollection={selectedCollection}
        />
      </div>

      {/* Bulk Management Panel */}
      {showBulkManagement && (
        <div className="mb-6">
          <BulkManagement
            cards={cards}
            selectedCardIds={selectedCardIds}
            onSelectionChange={setSelectedCardIds}
            onRefresh={onRefresh}
          />
        </div>
      )}

      {/* Enhanced Search and Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search recipe cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
          <Select value={selectedCollection} onValueChange={setSelectedCollection}>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Filter by collection..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <span>All Cards</span>
                  <Badge variant="secondary">{cards.length}</Badge>
                </div>
              </SelectItem>
              {collections.map(collection => (
                <SelectItem key={collection.id} value={collection.id}>
                  <div className="flex items-center gap-2">
                    <span>{collection.name}</span>
                    <Badge variant="secondary">{collection.card_count || 0}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Collections Quick View */}
      {collections.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Collections Overview</h3>
            <Button onClick={handleRefreshAll} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {collections.map(collection => (
              <Card key={collection.id} className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">{collection.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {collection.card_count || 0}
                    </Badge>
                  </div>
                  {collection.description && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <div className="flex gap-1">
                    <Button
                      onClick={() => setSelectedCollection(collection.id)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-blue-600 text-xs"
                    >
                      Filter View
                    </Button>
                    <Button
                      onClick={() => handleViewCollection(collection.id)}
                      variant="ghost"
                      size="sm"
                      className="flex-1 text-green-600 text-xs"
                    >
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Cards</p>
                <p className="text-2xl font-bold">{cards.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">B</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Beginner</p>
                <p className="text-2xl font-bold">{cards.filter(c => c.difficulty === 'Beginner').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">I</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Intermediate</p>
                <p className="text-2xl font-bold">{cards.filter(c => c.difficulty === 'Intermediate').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">A</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Advanced</p>
                <p className="text-2xl font-bold">{cards.filter(c => c.difficulty === 'Advanced').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Selection Controls */}
      {filteredCards.length > 0 && (
        <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedCardIds.length === filteredCards.length}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              Select All ({filteredCards.length})
            </label>
          </div>
          
          {selectedCardIds.length > 0 && (
            <Badge variant="secondary">
              {selectedCardIds.length} selected
            </Badge>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {cards.length === 0 ? 'No recipe cards yet' : 'No cards match your search'}
            </h3>
            <p className="text-gray-500 mb-4">
              {cards.length === 0 
                ? 'Create your first recipe card to get started.'
                : 'Try adjusting your search terms or collection filter.'
              }
            </p>
            {cards.length === 0 && (
              <Button onClick={onNewCard}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Card
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card key={card.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      checked={selectedCardIds.includes(card.id)}
                      onCheckedChange={(checked) => handleSelectCard(card.id, checked as boolean)}
                    />
                    <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">
                      {card.name}
                    </CardTitle>
                  </div>
                  <Badge className={`${getDifficultyColor(card.difficulty)} text-xs ml-2 flex-shrink-0`}>
                    {card.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {card.whatItDoes}
                </p>
                <p className="text-xs text-gray-500">
                  <strong>For:</strong> {card.whoItsFor}
                </p>

                {/* Show collection membership */}
                {cardCollectionMap[card.id] && cardCollectionMap[card.id].length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {cardCollectionMap[card.id].map(collectionName => (
                      <Badge key={collectionName} variant="outline" className="text-xs">
                        {collectionName}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button onClick={() => onViewCard(card)} variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button onClick={() => onEditCard(card)} variant="outline" size="sm">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => onExportCard(card, 'pdf')}
                    variant="outline"
                    size="sm"
                    className="text-blue-600"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                  <Button
                    onClick={() => onExportCard(card, 'markdown')}
                    variant="outline"
                    size="sm"
                    className="text-green-600"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    MD
                  </Button>
                  <Button
                    onClick={() => onDeleteCard(card.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Floating Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCardIds={selectedCardIds}
        collections={collections}
        onAssignToCollection={handleAssignToCollection}
        onRemoveFromCollection={handleRemoveFromCollection}
        onClearSelection={() => setSelectedCardIds([])}
        onDeleteCards={handleDeleteSelectedCards}
      />
    </div>
  );
};

export default RecipeCardLibrary;
