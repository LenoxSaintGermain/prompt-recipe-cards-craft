
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collection } from '@/hooks/useCollections';
import { FolderOpen, BarChart3 } from 'lucide-react';

interface CollectionStatsProps {
  collections: Collection[];
  totalCards: number;
  selectedCollection: string;
}

const CollectionStats: React.FC<CollectionStatsProps> = ({ 
  collections, 
  totalCards, 
  selectedCollection 
}) => {
  const getCollectionStats = () => {
    if (selectedCollection === 'all') {
      return {
        name: 'All Collections',
        cardCount: totalCards,
        collectionCount: collections.length
      };
    }
    
    const collection = collections.find(c => c.id === selectedCollection);
    return {
      name: collection?.name || 'Unknown Collection',
      cardCount: collection?.card_count || 0,
      collectionCount: 1
    };
  };

  const stats = getCollectionStats();

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">{stats.name}</h3>
              <p className="text-sm text-blue-600">
                {stats.cardCount} cards
                {selectedCollection === 'all' && ` across ${stats.collectionCount} collections`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedCollection === 'all' ? 'All' : 'Filtered'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionStats;
