
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCollections } from '@/hooks/useCollections';
import { Plus, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface CollectionQuickActionsProps {
  onRefresh: () => void;
}

const CollectionQuickActions: React.FC<CollectionQuickActionsProps> = ({ onRefresh }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const { createCollection } = useCollections();

  const handleCreatePerplexityCollection = async () => {
    const name = 'Perplexity Training';
    const description = 'A collection of prompt recipes specifically designed for Perplexity Enterprise workflows, including advanced search strategies, AI-powered research techniques, and business intelligence queries.';
    
    const success = await createCollection(name, description);
    if (success) {
      onRefresh();
      toast.success('Perplexity Training collection created!');
    }
  };

  const handleCreateCustomCollection = async () => {
    if (!newCollectionName.trim()) {
      toast.error('Please enter a collection name');
      return;
    }

    const success = await createCollection(newCollectionName, newCollectionDescription);
    if (success) {
      setNewCollectionName('');
      setNewCollectionDescription('');
      setIsCreateDialogOpen(false);
      onRefresh();
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleCreatePerplexityCollection}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Zap className="w-4 h-4 mr-2" />
        Create Perplexity Training
      </Button>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Custom Collection
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="collection-name">Collection Name</Label>
              <Input
                id="collection-name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Enter collection name..."
              />
            </div>
            <div>
              <Label htmlFor="collection-description">Description (Optional)</Label>
              <Textarea
                id="collection-description"
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
                placeholder="Describe what this collection is for..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCustomCollection}>
                Create Collection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionQuickActions;
