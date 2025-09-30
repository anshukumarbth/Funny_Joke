
'use server';

import { generateJokeAndImage, JokeAndImageOutput } from '@/ai/flows/generate-joke-and-image';

export type JokeResult = {
  data?: JokeAndImageOutput;
  error?: string;
};

export async function getJoke(category: string): Promise<JokeResult> {
  if (!category) {
    return { error: 'Category is required.' };
  }

  try {
    const result = await generateJokeAndImage({ category });
    return { data: result };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate a joke. ${errorMessage}` };
  }
}
