
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Recipe Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g., Generate a Client Intelligence Brief"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select value={formData.difficulty} onValueChange={(value) => updateField('difficulty', value as any)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="whatItDoes">What it does</Label>
        <Textarea
          id="whatItDoes"
          value={formData.whatItDoes}
          onChange={(e) => updateField('whatItDoes', e.target.value)}
          placeholder="Briefly explain the outcome of using this recipe..."
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="whoItsFor">Who it's for</Label>
        <Textarea
          id="whoItsFor"
          value={formData.whoItsFor}
          onChange={(e) => updateField('whoItsFor', e.target.value)}
          placeholder="Identify the primary target roles who would benefit..."
          className="mt-1"
          rows={2}
        />
      </div>
    </>
  );
};

export default BasicInfoSection;
