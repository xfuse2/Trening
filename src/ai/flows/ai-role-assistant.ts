'use server';

/**
 * @fileOverview An AI assistant tailored to a specific role in a marketing company.
 *
 * - aiRoleAssistant - A function that provides AI-powered assistance for a given role.
 * - AiRoleAssistantInput - The input type for the aiRoleAssistant function.
 * - AiRoleAssistantOutput - The return type for the aiRoleAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiRoleAssistantInputSchema = z.object({
  roleTitle: z.string().describe('The title of the role (e.g., Moderator, Content Writer).'),
  roleGoal: z.string().describe('The goal of the role.'),
  query: z.string().describe('The user query seeking assistance.'),
});
export type AiRoleAssistantInput = z.infer<typeof AiRoleAssistantInputSchema>;

const AiRoleAssistantOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the user query.'),
});
export type AiRoleAssistantOutput = z.infer<typeof AiRoleAssistantOutputSchema>;

export async function aiRoleAssistant(input: AiRoleAssistantInput): Promise<AiRoleAssistantOutput> {
  return aiRoleAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiRoleAssistantPrompt',
  input: {schema: AiRoleAssistantInputSchema},
  output: {schema: AiRoleAssistantOutputSchema},
  prompt: `You are an intelligent assistant specializing in the role of "{{{roleTitle}}}" in a marketing company.
Your job is to: {{{roleGoal}}}
The user is asking: "{{{query}}}"

Provide a helpful, practical, and very professional answer in Arabic that helps the employee accomplish their tasks.
If the request is to write content or a reply, write the draft directly.
`,
});

const aiRoleAssistantFlow = ai.defineFlow(
  {
    name: 'aiRoleAssistantFlow',
    inputSchema: AiRoleAssistantInputSchema,
    outputSchema: AiRoleAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
