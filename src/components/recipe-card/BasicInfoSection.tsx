import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RecipeCard } from '@/components/RecipeCardEditor';

interface BasicInfoSectionProps {
  formData: RecipeCard;
  updateField: (field: keyof RecipeCard, value: any) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formData, updateField }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Pattern Title
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g., Generate a Client Intelligence Brief"
            className="h-12 px-4 bg-secondary/50 border-0 rounded-xl focus:bg-background focus:ring-2 focus:ring-accent/20 transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty" className="text-sm font-medium text-foreground">
            Difficulty Level
          </Label>
          <Select value={formData.difficulty} onValueChange={(value) => updateField('difficulty', value as any)}>
            <SelectTrigger className="h-12 px-4 bg-secondary/50 border-0 rounded-xl focus:ring-2 focus:ring-accent/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-difficulty-beginner" />
                  Beginner
                </span>
              </SelectItem>
              <SelectItem value="Intermediate">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-difficulty-intermediate" />
                  Intermediate
                </span>
              </SelectItem>
              <SelectItem value="Advanced">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-difficulty-advanced" />
                  Advanced
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatItDoes" className="text-sm font-medium text-foreground">
          What it does
        </Label>
        <Textarea
          id="whatItDoes"
          value={formData.whatItDoes}
          onChange={(e) => updateField('whatItDoes', e.target.value)}
          placeholder="Briefly explain the outcome of using this pattern..."
          className="min-h-[100px] px-4 py-3 bg-secondary/50 border-0 rounded-xl resize-none focus:bg-background focus:ring-2 focus:ring-accent/20 transition-all duration-200"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whoItsFor" className="text-sm font-medium text-foreground">
          Who it's for
        </Label>
        <Textarea
          id="whoItsFor"
          value={formData.whoItsFor}
          onChange={(e) => updateField('whoItsFor', e.target.value)}
          placeholder="Identify the primary target roles who would benefit..."
          className="min-h-[80px] px-4 py-3 bg-secondary/50 border-0 rounded-xl resize-none focus:bg-background focus:ring-2 focus:ring-accent/20 transition-all duration-200"
          rows={2}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
