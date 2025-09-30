'use server';

/**
 * @fileOverview Generates an image based on a prompt.
 *
 * - generateImage - A function that generates an image.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateImageInputSchema, GenerateImageOutputSchema } from '@/ai/schemas';

export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A vibrant, cinematic, and funny image inspired by the following scene: "${input.prompt}". The image should be in the style of ${input.style_hint}. Do not include any text, letters, or watermarks in the image.`,
    });
    
    if (!media.url) {
        throw new Error("Image generation failed.");
    }

    return { imageUrl: media.url };
  }
);
