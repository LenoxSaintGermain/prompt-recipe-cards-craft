import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useCollections } from '@/hooks/useCollections';
import { Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CollectionQuickActionsProps {
  onRefresh: () => void;
}

const CollectionQuickActions: React.FC<CollectionQuickActionsProps> = ({ onRefresh }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const { createCollection } = useCollections();

  const handleCreateStarterCollection = async () => {
    const name = 'AI Mastery';
    const description = 'A curated collection of prompt patterns for mastering AI workflows, including research strategies, content creation, and business intelligence.';
    
    const success = await createCollection(name, description);
    if (success) {
      onRefresh();
      toast.success('AI Mastery collection created!');
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
    <div className="flex gap-3">
      <Button 
        onClick={handleCreateStarterCollection}
        className="rounded-xl bg-foreground text-background hover:bg-foreground/90 press-effect"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Create AI Mastery Collection
      </Button>
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="rounded-xl press-effect">
            <Plus className="w-4 h-4 mr-2" />
            Custom Collection
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name" className="text-sm font-medium">Collection Name</Label>
              <Input
                id="collection-name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Enter collection name..."
                className="h-12 px-4 bg-secondary/50 border-0 rounded-xl focus:bg-background focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description" className="text-sm font-medium">Description (Optional)</Label>
              <Textarea
                id="collection-description"
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
                placeholder="Describe what this collection is for..."
                className="min-h-[100px] px-4 py-3 bg-secondary/50 border-0 rounded-xl resize-none focus:bg-background focus:ring-2 focus:ring-accent/20"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateDialogOpen(false)}
                className="rounded-xl press-effect"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateCustomCollection}
                className="rounded-xl bg-foreground text-background hover:bg-foreground/90 press-effect"
              >
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
