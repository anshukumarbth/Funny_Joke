'use server';

/**
 * @fileOverview Generates a joke and associated image prompts for a given category.
 *
 * - generateJokeAndImage - A function that generates a joke and image prompts.
 * - JokeAndImageInput - The input type for the generateJokeAndImage function.
 * - JokeAndImageOutput - The return type for the generateJokeAndImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JokeAndImageInputSchema = z.object({
  category: z.string().describe('The category of the joke.'),
});
export type JokeAndImageInput = z.infer<typeof JokeAndImageInputSchema>;

const JokeAndImageOutputSchema = z.object({
  category: z.string().describe('The category of the joke.'),
  joke_id: z.string().describe('A unique ID for the joke in the format J-[6char ID].'),
  joke_type: z.enum(['SetupPunchline', 'OneLiner', 'Scenario']).describe('The format of the joke.'),
  joke: z
    .object({
      setup: z.string().describe('The setup for the joke, may be empty if OneLiner.'),
      punchline: z.string().describe('The punchline for the joke.'),
    })
    .describe('The joke content.'),
  image:
    z.object({
      style_hint: z.string().describe('2-3 words describing the visual style of the image.'),
      image_prompt: z.string().describe('A funny, cinematic, detailed visual prompt for image generation.'),
    })
    .describe('The image prompts for the joke.'),
});

export type JokeAndImageOutput = z.infer<typeof JokeAndImageOutputSchema>;

export async function generateJokeAndImage(input: JokeAndImageInput): Promise<JokeAndImageOutput> {
  return generateJokeAndImageFlow(input);
}

const generateJokeAndImagePrompt = ai.definePrompt({
  name: 'generateJokeAndImagePrompt',
  input: {schema: JokeAndImageInputSchema},
  output: {schema: JokeAndImageOutputSchema},
  prompt: `You are 'LaughTrack-API', a joke content engine for a Next.js website. Generate a joke in JSON format based on the following category. Adhere to the following rules and schema:

🎭 Rules:
- Jokes must be witty, fresh, PG-rated, and original.  
- Use formats: \"SetupPunchline\", \"OneLiner\", or \"Scenario\".  
- Punchlines should feel surprising and fun for animation.

🎨 Visuals:
- Each joke must include an image with:
  - \"style_hint\": 2–3 words (e.g., \"Comic Noir\", \"Retro Vaporwave\").  
  - \"image_prompt\": A funny, cinematic, detailed visual (no text or watermarks).

📦 Schema:
{
  \"category\": \"{{{category}}}\",
  \"joke_id\": \"J-[6char ID]\".
  \"joke_type\": \"SetupPunchline\" | \"OneLiner\" | \"Scenario\",
  \"joke\": {
    \"setup\": \"[text or empty if OneLiner]\".
    \"punchline\": \"[text]\"
  },
  \"image\": {
    \"style_hint\": \"[2–3 words]\".
    \"image_prompt\": \"[funny descriptive visual prompt]\"
  }
}

Category: {{{category}}}
`, // Adjusted prompt to use Handlebars and include the category
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
