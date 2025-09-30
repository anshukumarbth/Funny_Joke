/**
 * @fileOverview Zod schemas for AI flows. This file does not have 'use server'
 * because it is imported by server-side files that do, and it is also
 * imported by client-side files.
 */
import {z} from 'genkit';

export const JokeAndImageInputSchema = z.object({
  category: z.string().describe('The category of the joke.'),
});

export const JokeAndImageOutputSchema = z.object({
  category: z.string().describe('The category of the joke.'),
  joke_id: z.string().describe('A unique ID for the joke in the format J-[6char ID].'),
  joke_type: z.enum(['SetupPunchline', 'OneLiner', 'Scenario']).describe('The format of the joke.'),
  joke: z
    .object({
      setup: z.string().describe('The setup for the joke, may be empty if OneLiner.'),
      punchline: z.string().describe('The punchline for the joke.'),
    })
    .describe('The joke content in English.'),
  hindi_joke: z
    .object({
      setup: z.string().describe('The setup for the joke in Hindi, may be empty if OneLiner.'),
      punchline: z.string().describe('The punchline for the joke in Hindi.'),
    })
    .describe('The joke content in Hindi.'),
});
