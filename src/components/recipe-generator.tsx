'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

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
import { handleGenerateRecipe } from '@/app/actions';
import { Sparkles, LoaderCircle } from 'lucide-react';
import RecipeDisplay from './recipe-display';
import RecipeLoading from './recipe-loading';
import {
  useAuth,
  useUser,
  initiateAnonymousSignIn,
  useFirestore,
} from '@/firebase';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipes-from-ingredients';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


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
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
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
    if (!recipe || !user || !firestore) return;
    
    setIsSaving(true);
    
    try {
      const favoritesCollection = collection(firestore, 'users', user.uid, 'favorites');
      
      addDoc(favoritesCollection, {
        ...recipe,
        ingredients: form.getValues('ingredients'),
        createdAt: serverTimestamp(),
      }).catch(error => {
          const permissionError = new FirestorePermissionError({
            path: favoritesCollection.path,
            operation: 'create',
            requestResourceData: recipe
          });
          errorEmitter.emit('permission-error', permissionError);
          // Also show a toast to the user
          toast({
            variant: 'destructive',
            title: 'Oeps! Kon recept niet opslaan.',
            description: 'Je hebt mogelijk geen toestemming om dit te doen.',
          });
      });

      toast({
        title: "Recept opgeslagen!",
        description: `${recipe.title} is toegevoegd aan je favorieten.`,
      });
      setIsSaved(true);

    } catch (e: any) {
       toast({
        variant: 'destructive',
        title: 'Oeps! Er is iets misgegaan.',
        description: e.message || 'Kon het recept niet opslaan.',
      });
    }

    setIsSaving(false);
  }

  const displayRecipe = useMemo(() => {
    if (isLoading) return <RecipeLoading />;
    if (recipe) {
      return (
        <RecipeDisplay
          recipe={recipe}
          onSave={saveRecipe}
          isSaving={isSaving}
          isSaved={isSaved}
          canSave={!!user}
        />
      );
    }
    return null;
  }, [isLoading, recipe, isSaving, isSaved, user]);


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
      {displayRecipe}
    </div>
  );
}
