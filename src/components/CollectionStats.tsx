import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collection } from '@/hooks/useCollections';
import { FolderOpen } from 'lucide-react';

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
    <Card className="border border-border rounded-2xl bg-secondary/20">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{stats.name}</h3>
              <p className="text-sm text-muted-foreground">
                {stats.cardCount} pattern{stats.cardCount !== 1 ? 's' : ''}
                {selectedCollection === 'all' && ` across ${stats.collectionCount} collection${stats.collectionCount !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="rounded-full">
            {selectedCollection === 'all' ? 'All' : 'Filtered'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollectionStats;
