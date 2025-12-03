'use server';

/**
 * @fileOverview Implements the interactive roleplay flow for practicing follow-up client interactions.
 *
 * - followupRoleplay - The function to start and manage the follow-up roleplay simulation.
 * - FollowupRoleplayInput - The input type for the followupRoleplay function.
 * - FollowupRoleplayOutput - The return type for the followupRoleplay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FollowupRoleplayInputSchema = z.object({
  scenario: z.string().describe('A description of the follow-up scenario for the roleplay.'),
  userMessage: z.string().optional().describe('The user message in response to the scenario.'),
  history: z
    .array(z.object({role: z.enum(['ai', 'user']), text: z.string()}))
    .optional()
    .describe('The history of messages in the roleplay.'),
});
export type FollowupRoleplayInput = z.infer<typeof FollowupRoleplayInputSchema>;

const FollowupRoleplayOutputSchema = z.object({
  aiResponse: z.string().describe('The AI response to the user message.'),
  feedback: z.string().optional().describe('The feedback on the user message.'),
  history: z
    .array(z.object({role: z.enum(['ai', 'user']), text: z.string()}))
    .describe('The updated history of messages in the roleplay.'),
});
export type FollowupRoleplayOutput = z.infer<typeof FollowupRoleplayOutputSchema>;

export async function followupRoleplay(
  input: FollowupRoleplayInput
): Promise<FollowupRoleplayOutput> {
  return followupRoleplayFlow(input);
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
    return '';
  }
}

const followupRoleplayFlow = ai.defineFlow(
  {
    name: 'followupRoleplayFlow',
    inputSchema: FollowupRoleplayInputSchema,
    outputSchema: FollowupRoleplayOutputSchema,
  },
  async (input) => {
    const { scenario, userMessage, history = [] } = input;

    let aiResponse: string;

    if (userMessage) {
      // Continue the conversation - just respond as the client
      const historyText = history
        .map((m) => `${m.role === 'user' ? 'مسؤول المتابعة' : 'العميل'}: ${m.text}`)
        .join('\n');

      const prompt = `You are acting as a client in a training scenario for XFuse, a digital agency in Egypt. This is specifically a follow-up account management scenario.

Training Scenario:
"${scenario}"

Conversation History So Far:
${historyText}

The account manager just sent this message:
"${userMessage}"

Your Task: As the client, provide a realistic and engaging response to the account manager's message in Egyptian Arabic. Stay in character based on the scenario. Your responses should reflect the client's needs, concerns, and emotions as described in the scenario.

Write only the client's reply. Do not add anything else.`;

      const result = await callGemini(prompt);

      if (result) {
        aiResponse = result.trim();
      } else {
        aiResponse = 'عفواً، لم أفهم ردك. هل يمكنك التوضيح؟';
      }

    } else {
      // Start the conversation
      const prompt = `You are an AI trainer for XFuse, a digital agency in Egypt. You must act as the client described in the follow-up account management scenario.
Your goal is to start the conversation by acting as the client based on the scenario.
Make your opening statement challenging but realistic, in a professional Egyptian Arabic dialect.
Remember: The account manager's job is to understand your needs, build trust, and ensure your satisfaction.

Training Scenario:
"${scenario}"

Write only the client's first message. Do not add anything else.`;

      const result = await callGemini(prompt);

      if (result) {
        aiResponse = result.trim();
      } else {
        aiResponse = 'مرحباً، أنا بحتاج نتكلم عن الخدمات اللي احنا متعاملين فيها.';
      }
    }

    const newHistory = [
      ...history,
      ...(userMessage ? [{ role: 'user' as const, text: userMessage }] : []),
      { role: 'ai' as const, text: aiResponse },
    ];

    return {
      aiResponse,
      feedback: undefined,
      history: newHistory,
    };
  }
);
