'use server';

/**
 * @fileOverview Implements evaluation of follow-up account management performance during roleplay.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const FollowupEvaluationInputSchema = z.object({
  scenario: z.string().describe('The follow-up scenario that was played out.'),
  history: z
    .array(z.object({role: z.enum(['ai', 'user']), text: z.string()}))
    .describe('The conversation history between the account manager and the client.'),
});

export type FollowupEvaluationInput = z.infer<typeof FollowupEvaluationInputSchema>;

export const FollowupEvaluationOutputSchema = z.object({
  evaluation: z.string().describe('A detailed evaluation of the account manager performance.'),
});

export type FollowupEvaluationOutput = z.infer<typeof FollowupEvaluationOutputSchema>;

// Helper function to call Gemini
async function callGemini(prompt: string): Promise<string> {
  try {
    const response = await ai.generate({
      prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 2000,
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

const evaluateFollowupFlow = ai.defineFlow(
  {
    name: 'evaluateFollowupFlow',
    inputSchema: FollowupEvaluationInputSchema,
    outputSchema: FollowupEvaluationOutputSchema,
  },
  async (input) => {
    const { scenario, history } = input;

    // Format the conversation for evaluation
    const conversationText = history
      .map((m) => `${m.role === 'user' ? 'مسؤول المتابعة' : 'العميل'}: ${m.text}`)
      .join('\n');

    const prompt = `You are an expert trainer for account managers at XFuse, a digital agency in Egypt.
Your job is to evaluate the performance of an account manager in a follow-up roleplay scenario.

Scenario Context:
"${scenario}"

The Conversation:
${conversationText}

Please provide a comprehensive evaluation of the account manager's performance. Evaluate on these criteria (in Arabic):

1. **فهم الاحتياجات (Understanding Needs)**: Did the account manager understand what the client needed? Did they ask the right questions?

2. **بناء الثقة (Building Trust)**: Did they communicate with empathy and professionalism? Did they reassure the client?

3. **حل المشاكل (Problem-Solving)**: Did they address the client's concerns effectively? Did they provide clear solutions?

4. **إدارة التوقعات (Managing Expectations)**: Did they set realistic expectations? Did they explain processes clearly?

5. **الإغلاق والتابع (Closing & Follow-up)**: Did they end the conversation professionally? Did they commit to next steps?

6. **اللغة والتواصل (Communication)**: Was the language clear, professional, and in appropriate Egyptian Arabic? Did they avoid jargon?

Provide your evaluation in the following format:
**التقييم العام (Overall Assessment)**: [1-2 paragraph summary]

**النقاط الإيجابية (Strengths)**:
* [Strength 1]
* [Strength 2]
* [Strength 3]

---

**نقاط التحسين (Areas for Improvement)**:
* [Improvement 1]
* [Improvement 2]
* [Improvement 3]

---

**الدرجة النهائية (Final Score)**: [e.g., 8.5/10]

**ملخص النصائح (Action Items)**:
* [Action 1]
* [Action 2]

Be honest, supportive, and constructive in your feedback. Focus on behaviors that can be improved.`;

    const evaluation = await callGemini(prompt);

    if (!evaluation) {
      return {
        evaluation: 'عذراً، حدث خطأ في تقييم الأداء. يرجى المحاولة مرة أخرى.',
      };
    }

    return {
      evaluation: evaluation.trim(),
    };
  }
);

export async function evaluateFollowupPerformance(
  input: FollowupEvaluationInput
): Promise<FollowupEvaluationOutput> {
  return evaluateFollowupFlow(input);
}
