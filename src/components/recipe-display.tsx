'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Utensils } from 'lucide-react';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipes-from-ingredients';

type RecipeDisplayProps = {
  recipe: GenerateRecipeOutput;
  onSave: () => void;
  isSaving: boolean;
};

export default function RecipeDisplay({ recipe, onSave, isSaving }: RecipeDisplayProps) {
  return (
    <Card className="shadow-xl border animate-in fade-in-50 duration-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Utensils className="h-6 w-6 text-primary" />
            <div className='flex flex-col gap-1'>
              <CardTitle className="font-headline text-2xl">
                {recipe.title}
              </CardTitle>
              <CardDescription>
                Bereidingstijd: {recipe.preparationTime}
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onSave} disabled={isSaving}>
            <Heart className="h-6 w-6 text-primary/70 hover:fill-primary/20 transition-colors" />
            <span className="sr-only">Sla recept op</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-foreground space-y-4">
          <h3 className="font-bold text-lg">Stappen:</h3>
          <ol className="list-decimal list-inside space-y-2">
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
