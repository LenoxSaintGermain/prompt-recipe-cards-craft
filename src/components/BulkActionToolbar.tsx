
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Collection } from '@/hooks/useCollections';
import { X, FolderPlus, Trash2 } from 'lucide-react';

interface BulkActionToolbarProps {
  selectedCardIds: string[];
  collections: Collection[];
  onAssignToCollection: (collectionId: string) => void;
  onRemoveFromCollection: (collectionId: string) => void;
  onClearSelection: () => void;
  onDeleteCards: () => void;
}

const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({
  selectedCardIds,
  collections,
  onAssignToCollection,
  onRemoveFromCollection,
  onClearSelection,
  onDeleteCards
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('');

  const handleAssignToCollection = () => {
    if (selectedCollection) {
      onAssignToCollection(selectedCollection);
      setSelectedCollection('');
    }
  };

  const handleRemoveFromCollection = () => {
    if (selectedCollection) {
      onRemoveFromCollection(selectedCollection);
      setSelectedCollection('');
    }
  };

  if (selectedCardIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-96">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedCardIds.length} selected
            </Badge>
            <Button
              onClick={onClearSelection}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-1">
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select collection..." />
              </SelectTrigger>
              <SelectContent>
                {collections.map(collection => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleAssignToCollection}
              disabled={!selectedCollection}
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <FolderPlus className="w-4 h-4 mr-1" />
              Add to Collection
            </Button>

            <Button
              onClick={handleRemoveFromCollection}
              disabled={!selectedCollection}
              variant="outline"
              size="sm"
              className="text-orange-600 border-orange-300 hover:bg-orange-50"
            >
              Remove from Collection
            </Button>

            <Button
              onClick={onDeleteCards}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50 ml-2"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionToolbar;
