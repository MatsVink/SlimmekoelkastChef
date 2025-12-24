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
import { handleGenerateRecipe } from '@/app/actions';
import { Sparkles, LoaderCircle } from 'lucide-react';
import RecipeDisplay from './recipe-display';
import RecipeLoading from './recipe-loading';
import {
  useFirestore,
  useUser,
  initiateAnonymousSignIn,
  useAuth,
} from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const formSchema = z.object({
  ingredients: z.string().min(3, {
    message: 'Voer minimaal 3 tekens in.',
  }),
});

export default function RecipeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<string | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!user && !isUserLoading) {
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
    setRecipes(null);

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
      setRecipes(response.data.recipes);
      if (firestore) {
        const historyCollection = collection(firestore, 'recipe_history');
        addDocumentNonBlocking(historyCollection, {
          ingredients: values.ingredients,
          recipe: response.data.recipes,
          timestamp: serverTimestamp(),
        });
      }
    }

    setIsLoading(false);
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
            {isLoading ? (
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
      {recipes && <RecipeDisplay recipes={recipes} />}
    </div>
  );
}
