'use server';

import {
  generateRecipesFromIngredients,
  type GenerateRecipesFromIngredientsInput,
} from '@/ai/flows/generate-recipes-from-ingredients';
import { z } from 'zod';

const formSchema = z.object({
  ingredients: z.string().min(3, { message: 'Voer minimaal 3 tekens in.' }),
});

interface FormState {
  data: {
    recipes: string;
  } | null;
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
    const input: GenerateRecipesFromIngredientsInput = {
      ingredients: validatedFields.data.ingredients,
    };
    const result = await generateRecipesFromIngredients(input);
    return { data: { recipes: result.recipes }, error: null };
  } catch (e) {
    console.error(e);
    return {
      data: null,
      error:
        'Er is iets misgegaan bij het genereren van de recepten. Probeer het later opnieuw.',
    };
  }
}
