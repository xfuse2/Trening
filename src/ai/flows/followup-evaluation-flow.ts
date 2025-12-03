'use server';

/**
 * @fileOverview Implements evaluation of follow-up account management performance during roleplay.
 */

import {ai} from '@/ai/genkit';
import {
    FollowupEvaluationInputSchema,
    FollowupEvaluationOutputSchema,
    type FollowupEvaluationInput,
    type FollowupEvaluationOutput
} from './followup-evaluation-flow.types';

export async function evaluateFollowupPerformance(input: FollowupEvaluationInput): Promise<FollowupEvaluationOutput> {
  return evaluateFollowupPerformanceFlow(input);
}

const evaluationPrompt = ai.definePrompt({
  name: 'followupEvaluationPrompt',
  input: {
    schema: FollowupEvaluationInputSchema,
  },
  output: {
    schema: FollowupEvaluationOutputSchema,
  },
  prompt: `You are an expert trainer for account managers at XFuse, a digital agency in Egypt. Your task is to provide a final, comprehensive evaluation of an account manager's performance in a follow-up role-playing simulation. Your tone must be professional, objective, and constructive, using professional Egyptian Arabic.

The training scenario was:
"{{{scenario}}}"

This is the full conversation history:
{{#each history}}
  {{#ifEquals role "user"}}
    Account Manager (XFuse Employee): {{text}}
  {{else}}
    Client (AI): {{text}}
  {{/ifEquals}}
{{/each}}

Your Task:
Write a detailed performance evaluation in Markdown format. The evaluation MUST include the following sections, separated by '---':

1.  **التقييم العام:** (Provide an overall rating: ممتاز, جيد جدًا, جيد, مقبول, or ضعيف) and a 1-2 sentence justification.

2.  **نقاط القوة:** (List 2-3 specific positive points. What did the account manager do well? Be specific with examples from the conversation).

3.  **نقاط التحسين الرئيسية:** (List the most critical areas for improvement. Be direct and quote messages if necessary).

4.  **ملخص النصائح والإجراءات المقترحة:** (Provide 2-3 actionable steps the account manager can take to improve).

Your entire output should be one single markdown block. Focus on:
- Understanding client needs
- Building trust through empathy
- Problem-solving approach
- Managing expectations realistically
- Professional closing and follow-up
- Communication quality in Egyptian Arabic
`,
  template: {
    helpers: {
      ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  },
});

const evaluateFollowupFlow = ai.defineFlow(
  {
    name: 'evaluateFollowupFlow',
    inputSchema: FollowupEvaluationInputSchema,
    outputSchema: FollowupEvaluationOutputSchema,
  },
  async (input) => {
    const { output } = await evaluationPrompt(input);
    if (!output) {
      throw new Error('Failed to get evaluation from the prompt.');
    }
    return { evaluation: output.evaluation };
  }
);
