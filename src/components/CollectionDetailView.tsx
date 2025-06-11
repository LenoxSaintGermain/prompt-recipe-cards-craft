
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collection, useCollections } from '@/hooks/useCollections';
import { RecipeCard } from './RecipeCardEditor';
import { ArrowLeft, Trash2, Download, Eye, Edit } from 'lucide-react';

interface CollectionDetailViewProps {
  collection: Collection;
  onClose: () => void;
  onViewCard: (card: RecipeCard) => void;
  onEditCard: (card: RecipeCard) => void;
  onExportCard: (card: RecipeCard, format: 'pdf' | 'png' | 'markdown') => void;
}

const CollectionDetailView: React.FC<CollectionDetailViewProps> = ({
  collection,
  onClose,
  onViewCard,
  onEditCard,
  onExportCard
}) => {
  const { getCollectionCards, removeCardsFromCollection, exportCollection } = useCollections();
  const [cards, setCards] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  useEffect(() => {
    loadCards();
  }, [collection.id]);

  const loadCards = async () => {
    setLoading(true);
    const cardsData = await getCollectionCards(collection.id);
    setCards(cardsData);
    setLoading(false);
  };

  const handleRemoveCards = async () => {
    if (selectedCardIds.length === 0) return;
    
    await removeCardsFromCollection(collection.id, selectedCardIds);
    setSelectedCardIds([]);
    loadCards();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Button>
            <div>
              <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
              {collection.description && (
                <p className="text-purple-100">{collection.description}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => exportCollection(collection.id)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Actions */}
      {selectedCardIds.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedCardIds.length} cards selected
            </span>
            <div className="flex gap-2">
              <Button
                onClick={handleRemoveCards}
                variant="outline"
                size="sm"
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove from Collection
              </Button>
              <Button
                onClick={() => setSelectedCardIds([])}
                variant="ghost"
                size="sm"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {cards.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cards in this collection</h3>
            <p className="text-gray-500">Add cards to this collection from the main library.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Card key={card.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedCardIds.includes(card.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCardIds(prev => [...prev, card.id]);
                        } else {
                          setSelectedCardIds(prev => prev.filter(id => id !== card.id));
                        }
                      }}
                      className="mt-1"
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionDetailView;
