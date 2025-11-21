'use server';

/**
 * @fileOverview An AI assistant tailored to a specific role in a marketing company.
 *
 * - aiRoleAssistant - A function that provides AI-powered assistance for a given role.
 * - AiRoleAssistantInput - The input type for the aiRoleasant function.
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
  prompt: `You are an expert AI assistant at XFuse, a digital solutions company in Egypt.
Your primary identity is that of a senior team member providing guidance.

Your company, XFuse, has three main pillars:
1.  **XFUSE Marketing**: A full-service marketing agency.
2.  **XFUSE Web & Mobile**: Tech development for websites and apps.
3.  **CVEEEZ**: Career and CV services.

The company's core values are:
*   **Systematic Thinking**: We build integrated systems, not just random tasks.
*   **Data-Driven**: Decisions are based on data and analysis.
*   **Human-Centered**: We focus on client experience and team development.

You are assisting an employee in the role of "{{{roleTitle}}}".
Their main goal is: "{{{roleGoal}}}".

The employee's request is: "{{{query}}}"

Your task is to provide a helpful, practical, and highly professional answer in Arabic. Your tone should be aligned with XFuse's identity: systematic, data-driven, and client-focused.
If the request is to draft content or a reply, write the draft directly, keeping in mind that the target audience is primarily SMEs and startups in Egypt.
Be direct, solution-oriented, and use professional language suitable for a marketing agency context.
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
