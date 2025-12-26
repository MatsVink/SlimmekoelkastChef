'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { handleGenerateRecipe, handleSaveRecipe } from '@/app/actions';
import { Sparkles, LoaderCircle } from 'lucide-react';
import RecipeDisplay from './recipe-display';
import RecipeLoading from './recipe-loading';
import {
  useAuth,
  useUser,
  initiateAnonymousSignIn,
} from '@/firebase';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipes-from-ingredients';


const formSchema = z.object({
  ingredients: z.string().min(3, {
    message: 'Voer minimaal 3 tekens in.',
  }),
});

export default function RecipeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [recipe, setRecipe] = useState<GenerateRecipeOutput | null>(null);
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecipe(null);
    setIsSaved(false);

    const formData = new FormData();
    formData.append('ingredients', values.ingredients);

    const response = await handleGenerateRecipe(null, formData);

    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Oeps! Er is iets misgegaan.',
        description: response.error,
      });
    } else if (response.data) {
      setRecipe(response.data);
    }

    setIsLoading(false);
  }

  async function saveRecipe() {
    if (!recipe) return;
    
    // This check now prevents the toast from showing for anonymous users,
    // as the save button is already hidden. It remains as a safeguard.
    if (!user || user.isAnonymous) {
      return;
    }
    
    setIsSaving(true);
    const result = await handleSaveRecipe(
      {
        ...recipe,
        ingredients: form.getValues('ingredients'),
      },
      user.uid
    );
    
    if (result.success) {
      toast({
        title: "Recept opgeslagen!",
        description: `${recipe.title} is toegevoegd aan je favorieten.`,
      });
      setIsSaved(true);
    } else {
       toast({
        variant: 'destructive',
        title: 'Oeps! Er is iets misgegaan.',
        description: result.error,
      });
    }

    setIsSaving(false);
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 bg-card p-6 rounded-xl shadow-lg border"
        >
          <FormField
            control={form.control}
            name="ingredients"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Jouw ingrediënten</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="bijv. kip, rijst, broccoli..."
                    className="resize-none text-base"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading || isUserLoading}
            className="w-full transition-all"
            size="lg"
          >
            {isUserLoading ? (
               <>
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                Laden...
              </>
            ) : isLoading ? (
              <>
                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                Momentje, de chef is aan het denken...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Genereer Recepten
              </>
            )}
          </Button>
        </form>
      </Form>
      {isLoading && <RecipeLoading />}
      {recipe && <RecipeDisplay recipe={recipe} onSave={saveRecipe} isSaving={isSaving} isSaved={isSaved} canSave={!!user && !user.isAnonymous} />}
    </div>
  );
}
