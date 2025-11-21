'use server';

/**
 * @fileOverview Implements the interactive roleplay flow for practicing client interactions.
 *
 * - interactiveRoleplay - The function to start and manage the roleplay simulation.
 * - InteractiveRoleplayInput - The input type for the interactiveRoleplay function.
 * - InteractiveRoleplayOutput - The return type for the interactiveRoleplay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveRoleplayInputSchema = z.object({
  scenario: z
    .string()
    .describe('A description of the scenario for the roleplay.'),
  userMessage: z.string().optional().describe('The user message in response to the scenario.'),
  history: z
    .array(z.object({role: z.enum(['ai', 'user']), text: z.string()}))
    .optional()
    .describe('The history of messages in the roleplay.'),
});
export type InteractiveRoleplayInput = z.infer<typeof InteractiveRoleplayInputSchema>;

const InteractiveRoleplayOutputSchema = z.object({
  aiResponse: z.string().describe('The AI response to the user message.'),
  feedback: z.string().optional().describe('The feedback on the user message.'),
  history: z.array(z.object({role: z.enum(['ai', 'user']), text: z.string()})).describe('The updated history of messages in the roleplay.'),
});
export type InteractiveRoleplayOutput = z.infer<typeof InteractiveRoleplayOutputSchema>;

export async function interactiveRoleplay(input: InteractiveRoleplayInput): Promise<InteractiveRoleplayOutput> {
  return interactiveRoleplayFlow(input);
}

const interactiveRoleplayPrompt = ai.definePrompt({
  name: 'interactiveRoleplayPrompt',
  input: {
    schema: InteractiveRoleplayInputSchema,
  },
  output: {
    schema: InteractiveRoleplayOutputSchema,
  },
  prompt: `You are a role-playing assistant designed to simulate client interactions for training purposes.

  The user will provide a scenario, and you will respond as the client.
  The user can then respond to your message, and you will provide feedback on their response.

  Scenario: {{{scenario}}}

  {% if history %}
  Here is the history of the conversation so far:
  {{#each history}}
  {{#ifEquals role \"user\"}}
  User: {{text}}
  {{else}}
  AI: {{text}}
  {{/ifEquals}}
  {{/each}}
  {% endif %}

  {% if userMessage %}
  User Response: {{{userMessage}}}

  Provide a response as the client, and provide feedback on the user response. The response and feedback must be in Arabic.

  Your response should be engaging and realistic.
  The feedback should be constructive and specific, including what the user did well and what they could improve on.
  {% else %}
  Start the conversation as the client based on the scenario. The response must be in Arabic.
  {% endif %}

  Output:
  {
    "aiResponse": "The AI response to the user message.",
    "feedback": "The feedback on the user message.",
    "history": [{"role": "ai", "text": "..."}, {"role": "user", "text": "..."}]
  }`,
  config: {
    temperature: 0.7,
    maxOutputTokens: 1024,
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

const interactiveRoleplayFlow = ai.defineFlow(
  {
    name: 'interactiveRoleplayFlow',
    inputSchema: InteractiveRoleplayInputSchema,
    outputSchema: InteractiveRoleplayOutputSchema,
  },
  async input => {
    const {
      scenario,
      userMessage,
      history = [],
    } = input;

    const promptInput = {
      scenario,
      userMessage,
      history,
    };

    const {output} = await interactiveRoleplayPrompt(promptInput);

    if (!output) {
      throw new Error('No output from interactiveRoleplayPrompt');
    }

    const newHistory = [
      ...history,
      ...(userMessage ? [{role: 'user' as const, text: userMessage}] : []),
      {role: 'ai' as const, text: output.aiResponse},
    ];

    return {
      ...output,
      history: newHistory,
    };
  }
);
