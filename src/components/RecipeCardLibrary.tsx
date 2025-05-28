import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from './RecipeCardEditor';
import { Plus, Edit, Eye, Trash2, Download, Search, FileText } from 'lucide-react';

interface RecipeCardLibraryProps {
  cards: RecipeCard[];
  onNewCard: () => void;
  onEditCard: (card: RecipeCard) => void;
  onViewCard: (card: RecipeCard) => void;
  onDeleteCard: (cardId: string) => void;
  onExportCard: (card: RecipeCard, format: 'pdf' | 'png' | 'markdown') => void;
}

const RecipeCardLibrary: React.FC<RecipeCardLibraryProps> = ({
  cards,
  onNewCard,
  onEditCard,
  onViewCard,
  onDeleteCard,
  onExportCard
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState(cards);

  useEffect(() => {
    const filtered = cards.filter(card =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.whatItDoes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.whoItsFor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCards(filtered);
  }, [cards, searchTerm]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recipe Card Library</h1>
            <p className="text-purple-100">Manage your Perplexity Enterprise prompt recipes</p>
          </div>
          <Button onClick={onNewCard} className="bg-white text-purple-600 hover:bg-gray-100">
            <Plus className="w-4 h-4 mr-2" />
            New Recipe Card
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search recipe cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

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
                : 'Try adjusting your search terms.'
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
                  <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">
                    {card.name}
                  </CardTitle>
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
    </div>
  );
};

export default RecipeCardLibrary;
