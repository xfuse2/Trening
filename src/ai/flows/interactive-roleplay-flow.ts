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

// Helper function to call Gemini directly using ai.generate
async function callGemini(prompt: string): Promise<string> {
  try {
    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.9,
        maxOutputTokens: 1024,
        safetySettings: [
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      },
    });
    return response.text || '';
  } catch (error) {
    console.error('Gemini API Error:', error);
    // Return an empty string or a default error message to avoid crashing the flow
    return '';
  }
}

const interactiveRoleplayFlow = ai.defineFlow(
  {
    name: 'interactiveRoleplayFlow',
    inputSchema: InteractiveRoleplayInputSchema,
    outputSchema: InteractiveRoleplayOutputSchema,
  },
  async (input) => {
    const { scenario, userMessage, history = [] } = input;

    let aiResponse: string;

    if (userMessage) {
      // Continue the conversation - just respond as the client
      const historyText = history
        .map((m) => `${m.role === 'user' ? 'الموظف' : 'العميل'}: ${m.text}`)
        .join('\n');

      const prompt = `You are acting as a client in a training scenario for XFuse, a digital agency in Egypt.

Training Scenario:
"${scenario}"

Conversation History So Far:
${historyText}

The employee just sent this message:
"${userMessage}"

Your Task: As the client, provide a realistic and engaging response to the employee's message in Egyptian Arabic. Stay in character based on the scenario.

Write only the client's reply. Do not add anything else.`;

      const result = await callGemini(prompt);
      
      if (result) {
        aiResponse = result.trim();
      } else {
        // Fallback response if the AI fails
        aiResponse = 'عفواً، لم أفهم ردك. هل يمكنك التوضيح؟';
      }

    } else {
      // Start the conversation
      const prompt = `You are an AI trainer for XFuse, a digital agency in Egypt. You must act as the client described in the scenario.
Your goal is to start the conversation by acting as the client based on the scenario.
Make your opening statement challenging but realistic, in a professional Egyptian Arabic dialect.

Training Scenario:
"${scenario}"

Write only the client's first message. Do not add anything else.`;

      const result = await callGemini(prompt);

      if (result) {
        aiResponse = result.trim();
      } else {
        // Fallback response if the AI fails to start
        aiResponse = 'مرحباً، كيف يمكنني مساعدتك اليوم؟';
      }
    }

    const newHistory = [
      ...history,
      ...(userMessage ? [{ role: 'user' as const, text: userMessage }] : []),
      { role: 'ai' as const, text: aiResponse },
    ];

    // Important: Feedback is now handled by a separate flow (evaluateRoleplayPerformance), so we don't generate it here.
    return {
      aiResponse,
      feedback: undefined,
      history: newHistory,
    };
  }
);
