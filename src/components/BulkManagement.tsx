import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollections, Collection } from '@/hooks/useCollections';
import { useJsonImport, CardTemplate } from '@/hooks/useJsonImport';
import { RecipeCard } from './RecipeCardEditor';
import ImportJobTracker from './ImportJobTracker';
import { FolderPlus, Upload, Download, Plus, Trash2, Users, FileJson, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface BulkManagementProps {
  cards: RecipeCard[];
  selectedCardIds: string[];
  onSelectionChange: (cardIds: string[]) => void;
  onRefresh: () => void;
}

const BulkManagement: React.FC<BulkManagementProps> = ({
  cards,
  selectedCardIds,
  onSelectionChange,
  onRefresh
}) => {
  const { collections, createCollection, deleteCollection, addCardsToCollection, exportCollection } = useCollections();
  const { createImportJob, processImportJob, loading: importLoading } = useJsonImport();
  
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [importJobName, setImportJobName] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      toast.error('Collection name is required');
      return;
    }

    const success = await createCollection(newCollectionName, newCollectionDescription);
    if (success) {
      setNewCollectionName('');
      setNewCollectionDescription('');
      setShowCreateCollection(false);
    }
  };

  const handleAddToCollection = async () => {
    if (!selectedCollection || selectedCardIds.length === 0) {
      toast.error('Please select a collection and cards');
      return;
    }

    await addCardsToCollection(selectedCollection, selectedCardIds);
    onSelectionChange([]);
  };

  const handleJsonImport = async () => {
    if (!jsonInput.trim() || !importJobName.trim()) {
      toast.error('Please provide both JSON data and job name');
      return;
    }

    try {
      const templates: CardTemplate[] = JSON.parse(jsonInput);
      
      if (!Array.isArray(templates)) {
        throw new Error('JSON must be an array of card templates');
      }

      const job = await createImportJob(importJobName, templates);
      if (job) {
        // Start processing in the background
        processImportJob(job.id);
        setJsonInput('');
        setImportJobName('');
        setShowJsonImport(false);
        onRefresh();
        toast.success('Import job started! Check the progress below.');
      }
    } catch (error) {
      toast.error('Invalid JSON format. Please check your input.');
      console.error('JSON parse error:', error);
    }
  };

  const handleBulkExport = () => {
    const selectedCards = cards.filter(card => selectedCardIds.includes(card.id));
    
    const exportData = {
      cards: selectedCards,
      exported_at: new Date().toISOString(),
      count: selectedCards.length,
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipe_cards_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`${selectedCards.length} cards exported successfully!`);
  };

  const handleImportCollection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.collection && data.cards) {
          // This is a collection export
          setImportJobName(`Import: ${data.collection.name}`);
          setJsonInput(JSON.stringify(data.cards, null, 2));
          setShowJsonImport(true);
        } else if (Array.isArray(data.cards)) {
          // This is a bulk export
          setImportJobName(`Import: ${data.cards.length} cards`);
          setJsonInput(JSON.stringify(data.cards, null, 2));
          setShowJsonImport(true);
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        toast.error('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Bulk Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selection Info */}
          {selectedCardIds.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                {selectedCardIds.length} cards selected
              </span>
              <Button
                onClick={() => onSelectionChange([])}
                variant="ghost"
                size="sm"
                className="text-blue-700"
              >
                Clear Selection
              </Button>
            </div>
          )}

          {/* Bulk Actions */}
          <div className="flex flex-wrap gap-2">
            {selectedCardIds.length > 0 && (
              <>
                <Button onClick={handleBulkExport} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export Selected
                </Button>
                
                <Select onValueChange={setSelectedCollection}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Add to collection..." />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map(collection => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedCollection && (
                  <Button onClick={handleAddToCollection} size="sm">
                    Add to Collection
                  </Button>
                )}
              </>
            )}

            <Dialog open={showCreateCollection} onOpenChange={setShowCreateCollection}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FolderPlus className="w-4 h-4 mr-1" />
                  New Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Collection name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newCollectionDescription}
                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowCreateCollection(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCollection}>
                      Create Collection
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showJsonImport} onOpenChange={setShowJsonImport}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileJson className="w-4 h-4 mr-1" />
                  Import JSON
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Import Recipe Cards from JSON</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Import job name"
                    value={importJobName}
                    onChange={(e) => setImportJobName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Paste JSON data here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="min-h-48 font-mono text-sm"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowJsonImport(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleJsonImport} disabled={importLoading}>
                      {importLoading ? 'Processing...' : 'Import & Enhance with AI'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportCollection}
                className="hidden"
                id="import-file"
              />
              <Button variant="outline" size="sm" asChild>
                <label htmlFor="import-file" className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-1" />
                  Import File
                </label>
              </Button>
            </div>
          </div>

          {/* Collections List */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Collections</h4>
            {collections.length === 0 ? (
              <p className="text-sm text-gray-500">No collections yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {collections.map(collection => (
                  <div key={collection.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium text-sm">{collection.name}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {collection.card_count || 0} cards
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        onClick={() => exportCollection(collection.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => deleteCollection(collection.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Import Job Tracker */}
      <ImportJobTracker onRefresh={onRefresh} />
    </div>
  );
};

export default BulkManagement;
