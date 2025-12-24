'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import RecipeDisplay from '@/components/recipe-display';
import { GenerateRecipeOutput } from '@/ai/flows/generate-recipes-from-ingredients';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, AlertTriangle } from 'lucide-react';

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
    return query(
      collection(firestore, 'users', user.uid, 'favorites'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: favorites, isLoading, error } = useCollection<FavoriteRecipe>(favoritesQuery);

  if (isUserLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.isAnonymous) {
    return (
      <div className="container mx-auto py-8 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Inloggen vereist</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Log in om je favoriete recepten te bekijken.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
       <div className="container mx-auto py-8 text-center">
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
       </div>
    );
  }


  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mijn Favoriete Recepten</h1>
      {favorites && favorites.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <RecipeDisplay key={fav.id} recipe={fav} onSave={() => {}} isSaving={true} />
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="pt-6">
                <p>Je hebt nog geen favoriete recepten opgeslagen.</p>
            </CardContent>
        </Card>
      )}
    </main>
  );
}