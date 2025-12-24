'use server';

import {
  generateRecipe,
  type GenerateRecipeInput,
  type GenerateRecipeOutput,
} from '@/ai/flows/generate-recipes-from-ingredients';
import { db } from '@/firebase/server';
import { z } from 'zod';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  ingredients: z.string().min(3, { message: 'Voer minimaal 3 tekens in.' }),
});

interface FormState {
  data: GenerateRecipeOutput | null;
  error: string | null;
}

export async function handleGenerateRecipe(
  prevState: FormState | null,
  formData: FormData
): Promise<FormState> {
  const validatedFields = formSchema.safeParse({
    ingredients: formData.get('ingredients'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error:
        validatedFields.error.flatten().fieldErrors.ingredients?.[0] ||
        'Validatie mislukt.',
    };
  }

  try {
    const input: GenerateRecipeInput = {
      ingredients: validatedFields.data.ingredients,
    };
    const result = await generateRecipe(input);
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error:
        'Er is iets misgegaan bij het genereren van de recepten. Probeer het later opnieuw.',
    };
  }
}

interface SaveRecipeState {
  success: boolean;
  error: string | null;
}

export async function handleSaveRecipe(
  recipe: GenerateRecipeOutput & { ingredients: string },
  userId: string | null
): Promise<SaveRecipeState> {
  if (!userId) {
    return {
      success: false,
      error: 'Je moet ingelogd zijn om een recept op te slaan.',
    };
  }

  try {
    // Save to user's favorites
    const favoritesCollection = collection(db, 'users', userId, 'favorites');
    await addDoc(favoritesCollection, {
      ...recipe,
      createdAt: serverTimestamp(),
    });

    // Also save to general history for anonymous users
    const historyCollection = collection(db, 'recipe_history');
    await addDoc(historyCollection, {
      ingredients: recipe.ingredients,
      recipe: JSON.stringify(recipe),
      timestamp: serverTimestamp(),
    });

    return { success: true, error: null };
  } catch (e: any) {
    console.error('Failed to save recipe:', e);
    return {
      success: false,
      error: e.message || 'Kon het recept niet opslaan.',
    };
  }
}