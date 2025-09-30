'use server';

/**
 * @fileOverview Generates a joke and associated image prompts for a given category.
 *
 * - generateJokeAndImage - A function that generates a joke.
 * - JokeAndImageInput - The input type for the generateJokeAndImage function.
 * - JokeAndImageOutput - The return type for the generateJokeAndImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { JokeAndImageInputSchema, JokeAndImageOutputSchema } from '@/ai/schemas';


export type JokeAndImageInput = z.infer<typeof JokeAndImageInputSchema>;
export type JokeAndImageOutput = z.infer<typeof JokeAndImageOutputSchema>;

export async function generateJokeAndImage(input: JokeAndImageInput): Promise<JokeAndImageOutput> {
  return generateJokeAndImageFlow(input);
}

const generateJokeAndImagePrompt = ai.definePrompt({
  name: 'generateJokeAndImagePrompt',
  input: {schema: JokeAndImageInputSchema},
  output: {schema: JokeAndImageOutputSchema},
  prompt: `You are 'LaughTrack-API', a joke content engine for a Next.js website. Generate a joke in JSON format based on the following category. Provide the joke in both English and Hindi. Adhere to the following rules and schema:

🎭 Rules:
- Jokes must be witty, fresh, PG-rated, and original.  
- Use formats: "SetupPunchline", "OneLiner", or "Scenario".  
- Punchlines should feel surprising and fun for animation.
- Provide a Hindi translation for the joke.

📦 Schema:
{
  "category": "{{{category}}}",
  "joke_id": "J-[6char ID]",
  "joke_type": "SetupPunchline" | "OneLiner" | "Scenario",
  "joke": {
    "setup": "[text or empty if OneLiner]",
    "punchline": "[text]"
  },
  "hindi_joke": {
    "setup": "[hindi text or empty if OneLiner]",
    "punchline": "[hindi text]"
  }
}

Category: {{{category}}}
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateJokeAndImageFlow = ai.defineFlow(
  {
    name: 'generateJokeAndImageFlow',
    inputSchema: JokeAndImageInputSchema,
    outputSchema: JokeAndImageOutputSchema,
  },
  async input => {
    const jokeId = `J-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const result = await generateJokeAndImagePrompt({
      ...input,
      joke_id: jokeId,
    });
    return result.output!;
  }
);
