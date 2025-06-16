
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit3, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CollectionNameEditorProps {
  collectionId: string;
  currentName: string;
  onNameUpdated: (newName: string) => void;
  className?: string;
}

const CollectionNameEditor: React.FC<CollectionNameEditorProps> = ({
  collectionId,
  currentName,
  onNameUpdated,
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedName(currentName);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(currentName);
  };

  const handleSave = async () => {
    if (!editedName.trim()) {
      toast.error('Collection name cannot be empty');
      return;
    }

    if (editedName.trim() === currentName) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('collections')
        .update({ name: editedName.trim() })
        .eq('id', collectionId);

      if (error) throw error;

      onNameUpdated(editedName.trim());
      setIsEditing(false);
      toast.success('Collection name updated successfully!');
    } catch (error) {
      console.error('Error updating collection name:', error);
      toast.error('Failed to update collection name');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-2xl font-bold h-auto p-1 border-blue-300 focus:border-blue-500"
          autoFocus
          disabled={isLoading}
        />
        <Button
          onClick={handleSave}
          size="sm"
          variant="ghost"
          className="text-green-600 hover:text-green-700 p-1"
          disabled={isLoading}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          onClick={handleCancel}
          size="sm"
          variant="ghost"
          className="text-red-600 hover:text-red-700 p-1"
          disabled={isLoading}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <h1 className="text-3xl font-bold mb-2 cursor-pointer hover:text-blue-700 transition-colors" onClick={handleStartEdit}>
        {currentName}
      </h1>
      <Button
        onClick={handleStartEdit}
        size="sm"
        variant="ghost"
        className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 p-1"
      >
        <Edit3 className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CollectionNameEditor;
