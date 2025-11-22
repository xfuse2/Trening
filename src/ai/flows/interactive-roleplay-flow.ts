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

const AiAndFeedbackSchema = z.object({
  aiResponse: z.string().describe('The AI response to the user message.'),
  feedback: z.string().optional().describe('The feedback on the user message.'),
});

const InteractiveRoleplayInputSchema = z.object({
  scenario: z.string().describe('A description of the scenario for the roleplay.'),
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
  history: z
    .array(z.object({role: z.enum(['ai', 'user']), text: z.string()}))
    .describe('The updated history of messages in the roleplay.'),
});
export type InteractiveRoleplayOutput = z.infer<typeof InteractiveRoleplayOutputSchema>;

export async function interactiveRoleplay(
  input: InteractiveRoleplayInput
): Promise<InteractiveRoleplayOutput> {
  return interactiveRoleplayFlow(input);
}

// A dedicated, simpler prompt just for starting the conversation.
const startRoleplayPrompt = ai.definePrompt({
  name: 'startRoleplayPrompt',
  input: {
    schema: z.object({ scenario: z.string() }),
  },
  output: {
    schema: z.object({ aiResponse: z.string() }),
  },
  prompt: `You are a role-playing AI coach for XFuse, a digital agency in Egypt. You must act as the client described in the scenario.
Your goal is to start the conversation by acting as the client based on the scenario.
Make your opening statement challenging but realistic, in professional Egyptian Arabic dialect.

The training scenario is:
"{{{scenario}}}"

Generate only the client's first message.
`,
  config: {
    temperature: 0.8,
  },
});

// A dedicated prompt for continuing the conversation and providing feedback.
const continueRoleplayPrompt = ai.definePrompt({
  name: 'continueRoleplayPrompt',
  input: {
    schema: z.object({
      scenario: z.string(),
      userMessage: z.string(),
      history: z.array(z.object({ role: z.enum(['ai', 'user']), text: z.string() })),
    }),
  },
  output: {
    schema: AiAndFeedbackSchema,
  },
  prompt: `You are a role-playing AI coach for XFuse, a digital agency in Egypt. Your goal is to simulate realistic client interactions. You must act as the client described in the scenario.

Company Context: XFuse is a professional agency that values systematic, data-driven, and human-centered approaches. The employee you are training is expected to be professional, empathetic, and solution-oriented.

The training scenario is:
"{{{scenario}}}"

This is the conversation history so far:
{{#each history}}
  {{#ifEquals role "user"}}
    User (XFuse Employee): {{text}}
  {{else}}
    AI (Client): {{text}}
  {{/ifEquals}}
{{/each}}

The employee just sent this message:
"{{{userMessage}}}"

Your Task (in professional Egyptian Arabic dialect):

1.  **AI Response**: As the client, provide a realistic and engaging response to the employee's message. Stay in character based on the scenario.
2.  **Feedback**: As the AI Coach, provide constructive feedback on the employee's message. The feedback should be structured in two parts:
    *   **نقاط القوة:** (What did the employee do well? e.g., "استخدام لهجة هادئة، إظهار التعاطف").
    *   **نقاط للتحسين:** (What could be improved? Be specific. e.g., "كان من الأفضل اقتراح خطوة تالية واضحة بدلًا من ترك المحادثة مفتوحة").
    The feedback should help the employee align with XFuse's professional and solution-oriented values.
`,
  config: {
    temperature: 0.8,
    maxOutputTokens: 1024,
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
    ],
  },
  template: {
    helpers: {
      ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  },
});

const interactiveRoleplayFlow = ai.defineFlow(
  {
    name: 'interactiveRoleplayFlow',
    inputSchema: InteractiveRoleplayInputSchema,
    outputSchema: InteractiveRoleplayOutputSchema,
  },
  async (input) => {
    const { scenario, userMessage, history = [] } = input;

    let output: z.infer<typeof AiAndFeedbackSchema> | null;

    if (userMessage) {
      // If there is a user message, continue the conversation.
      const promptInput = { scenario, userMessage, history };
      const response = await continueRoleplayPrompt(promptInput);
      output = response.output;
    } else {
      // If there is no user message, it's the start. Just get the AI's first line.
      const promptInput = { scenario };
      const response = await startRoleplayPrompt(promptInput);
      output = { aiResponse: response.output!.aiResponse, feedback: undefined };
    }

    if (!output) {
      throw new Error('No output from the AI prompt');
    }
    
    const newHistory = [
      ...history,
      ...(userMessage ? [{ role: 'user' as const, text: userMessage }] : []),
      { role: 'ai' as const, text: output.aiResponse },
    ];

    return {
      ...output,
      history: newHistory,
    };
  }
);
