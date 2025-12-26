'use server';

import {
  generateRecipe,
  type GenerateRecipeInput,
  type GenerateRecipeOutput,
} from '@/ai/flows/generate-recipes-from-ingredients';
import { z } from 'zod';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Singleton pattern to ensure Firebase Admin is initialized only once.
if (!getApps().length) {
  try {
     const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
     initializeApp({
        credential: cert(serviceAccount)
     });
  } catch (e) {
    console.log("Initializing Firebase Admin without explicit credentials, assuming Application Default Credentials.");
    initializeApp();
  }
}

const db = getFirestore();


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

    try {
      await db.collection('recipe_history').add({
        ingredients: validatedFields.data.ingredients,
        recipe: JSON.stringify(result),
        timestamp: FieldValue.serverTimestamp(),
      });
    } catch (e) {
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
