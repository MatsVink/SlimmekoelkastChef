'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import RecipeDisplay from '@/components/recipe-display';
import { GenerateRecipeOutput } from '@/ai/flows/generate-recipes-from-ingredients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


type FavoriteRecipe = GenerateRecipeOutput & {
  id: string;
  ingredients: string;
  createdAt: { seconds: number; nanoseconds: number };
};

export default function FavoritesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const favoritesQuery = useMemo(() => {
    if (!firestore || !user) return null;
    const q = query(
      collection(firestore, 'users', user.uid, 'favorites'),
      orderBy('createdAt', 'desc')
    );
    // @ts-ignore
    q.__memo = true;
    return q;
  }, [firestore, user]);

  const { data: favorites, isLoading, error } = useCollection<FavoriteRecipe>(favoritesQuery);

  if (isUserLoading || (isLoading && !favorites)) {
    return (
      <div className="flex justify-center items-center pt-32">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Adjusted this check. We now allow anonymous users to see this page.
  if (!user) {
    return (
      <main className="container mx-auto py-8 pt-24 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Laden...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Favorieten worden geladen...</p>
          </CardContent>
        </Card>
      </main>
    );
  }
  
  if (error) {
    return (
       <main className="container mx-auto py-8 pt-24 text-center">
         <Card className="max-w-md mx-auto bg-destructive/10 border-destructive">
           <CardHeader>
             <CardTitle className="flex items-center justify-center gap-2 text-destructive">
                <AlertTriangle /> Fout bij laden
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-destructive/80">Kon je favorieten niet laden. Probeer het later opnieuw.</p>
             <p className="text-xs text-muted-foreground mt-2">{error.message}</p>
           </CardContent>
         </Card>
       </main>
    );
  }


  return (
    <main className="container mx-auto py-8 pt-24">
      <h1 className="text-3xl font-bold mb-8">Mijn Favoriete Recepten</h1>
      {favorites && favorites.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <RecipeDisplay key={fav.id} recipe={fav} isSaved={true} />
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center gap-4">
                <p>Je hebt nog geen favoriete recepten opgeslagen.</p>
                <Button asChild>
                    <Link href="/">Bedenk een recept</Link>
                </Button>
            </CardContent>
        </Card>
      )}
    </main>
  );
}
