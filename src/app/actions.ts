'use server';

import {
  generateRecipe,
  type GenerateRecipeInput,
  type GenerateRecipeOutput,
} from '@/ai/flows/generate-recipes-from-ingredients';
import { db } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

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

    // Save recipe generation to history for anonymous users
    try {
      await db.collection('recipe_history').add({
        ingredients: validatedFields.data.ingredients,
        recipe: JSON.stringify(result),
        timestamp: FieldValue.serverTimestamp(),
      });
    } catch (e) {
      // Non-critical, just log it on the server
      console.error('Failed to save recipe history:', e);
    }

    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error:
        'Er is iets misgegaan bij het genereren van het recept. Probeer het later opnieuw.',
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
    // Save to user's favorites using the Admin SDK
    const favoritesCollection = db.collection('users').doc(userId).collection('favorites');
    await favoritesCollection.add({
      ...recipe,
      createdAt: FieldValue.serverTimestamp(),
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
