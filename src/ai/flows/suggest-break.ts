'use server';

/**
 * @fileOverview Suggests a break activity based on recent sprint data and session history.
 *
 * - suggestBreak - A function that suggests a break activity.
 * - SuggestBreakInput - The input type for the suggestBreak function.
 * - SuggestBreakOutput - The return type for the suggestBreak function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBreakInputSchema = z.object({
  sprintCount: z
    .number()
    .describe('The number of sprints completed in the current session.'),
  streak: z.number().describe('The current streak of completed sprints.'),
  totalSprints: z
    .number()
    .describe('The total number of sprints completed across all sessions.'),
});
export type SuggestBreakInput = z.infer<typeof SuggestBreakInputSchema>;

const SuggestBreakOutputSchema = z.object({
  suggestion: z
    .string()
    .describe('A suggestion for a break activity, tailored to the user and their session history.'),
});
export type SuggestBreakOutput = z.infer<typeof SuggestBreakOutputSchema>;

export async function suggestBreak(input: SuggestBreakInput): Promise<SuggestBreakOutput> {
  return suggestBreakFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBreakPrompt',
  input: {schema: SuggestBreakInputSchema},
  output: {schema: SuggestBreakOutputSchema},
  prompt: `You are a helpful assistant that suggests break activities to users after they complete focus sprints.

  Consider the following information about the user's recent activity and overall history:

  - Sprints completed in current session: {{{sprintCount}}}
  - Current streak of completed sprints: {{{streak}}}
  - Total sprints completed across all sessions: {{{totalSprints}}}

  Based on this information, suggest a single, specific break activity that will help the user optimize their focus and productivity.
  Your response should be a single sentence.
  `,
});

const suggestBreakFlow = ai.defineFlow(
  {
    name: 'suggestBreakFlow',
    inputSchema: SuggestBreakInputSchema,
    outputSchema: SuggestBreakOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
