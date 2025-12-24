'use server';

/**
 * @fileOverview Generates a recipe based on a list of ingredients provided by the user.
 *
 * - generateRecipe - A function that generates a recipe from ingredients.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients (e.g., chicken, rice, broccoli).'),
});
export type GenerateRecipeInput = z.infer<
  typeof GenerateRecipeInputSchema
>;

const GenerateRecipeOutputSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  preparationTime: z.string().describe('The estimated preparation time.'),
  steps: z.array(z.string()).describe('The steps to prepare the recipe.'),
});
export type GenerateRecipeOutput = z.infer<
  typeof GenerateRecipeOutputSchema
>;

export async function generateRecipe(
  input: GenerateRecipeInput
): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `Ik heb deze ingrediënten: {{{ingredients}}}. Maak een kort, leuk recept met titel, bereidingstijd en stappen.`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
