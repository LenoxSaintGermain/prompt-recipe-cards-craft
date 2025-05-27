
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Save, Edit3 } from 'lucide-react';

interface LayoutEditorProps {
  isLayoutEditor: boolean;
  onToggleLayoutEditor: () => void;
  onResetLayout: () => void;
  onSaveLayout?: () => void;
}

const LayoutEditor: React.FC<LayoutEditorProps> = ({
  isLayoutEditor,
  onToggleLayoutEditor,
  onResetLayout,
  onSaveLayout
}) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 border rounded-lg">
      <Button
        onClick={onToggleLayoutEditor}
        variant={isLayoutEditor ? "default" : "outline"}
        size="sm"
        className="px-3"
      >
        <Edit3 className="w-4 h-4 mr-1" />
        {isLayoutEditor ? 'Exit Editor' : 'Edit Layout'}
      </Button>
      
      {isLayoutEditor && (
        <>
          <Button
            onClick={onResetLayout}
            variant="outline"
            size="sm"
            className="px-3"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          
          {onSaveLayout && (
            <Button
              onClick={onSaveLayout}
              variant="outline"
              size="sm"
              className="px-3"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
          )}
        </>
      )}
      
      {isLayoutEditor && (
        <span className="text-xs text-gray-600 ml-2">
          Drag sections to rearrange them
        </span>
      )}
    </div>
  );
};

export default LayoutEditor;
