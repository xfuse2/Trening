'use server';

/**
 * @fileOverview Implements a flow to evaluate the user's performance in a roleplay scenario.
 *
 * - evaluateRoleplayPerformance - The function to evaluate the entire conversation.
 */

import {ai} from '@/ai/genkit';
import {
    RoleplayEvaluationInputSchema,
    RoleplayEvaluationOutputSchema,
    type RoleplayEvaluationInput,
    type RoleplayEvaluationOutput
} from './roleplay-evaluation-flow.types';


const evaluationPrompt = ai.definePrompt({
  name: 'roleplayEvaluationPrompt',
  input: {
    schema: RoleplayEvaluationInputSchema,
  },
  output: {
    schema: RoleplayEvaluationOutputSchema,
  },
  prompt: `You are an expert performance coach for XFuse, a digital agency in Egypt. Your task is to provide a final, comprehensive evaluation of an employee's performance in a role-playing simulation. Your tone must be professional, objective, and constructive, using professional Egyptian Arabic.

The training scenario was:
"{{{scenario}}}"

This is the full conversation history:
{{#each history}}
  {{#ifEquals role "user"}}
    User (XFuse Employee): {{text}}
  {{else}}
    AI (Client): {{text}}
  {{/ifEquals}}
{{/each}}

Your Task:
Write a detailed performance evaluation in Markdown format. The evaluation MUST include the following sections, separated by '---':

1.  **التقييم العام:** (Provide an overall rating: ممتاز, جيد جدًا, جيد, مقبول, or ضعيف) and a one-sentence justification.

2.  **نقاط القوة:** (List 2-3 specific positive points. What did the employee do well? Be specific, e.g., "استخدمت عبارات تعاطف مثل 'أتفهم موقف حضرتك' في بداية المحادثة."). If there are no strengths, state that clearly.

3.  **نقاط الضعف الرئيسية:** (List the most critical areas for improvement. Be direct and quote the employee's messages if necessary, e.g., "الرد بـ 'ده اللي عندنا' كان رفضًا للمساعدة وأدى إلى تصعيد الموقف.").

4.  **نصيحة وإجراءات مقترحة:** (Provide 2-3 actionable steps the employee can take to improve, e.g., "تدرب على سيناريو 'عميل غاضب' مرة أخرى مع التركيز على احتواء الموقف قبل تقديم الحلول.").

Your entire output should be one single markdown block.
`,
  template: {
    helpers: {
      ifEquals: function (arg1, arg2, options) {
        return arg1 == arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  },
});

const evaluateRoleplayPerformanceFlow = ai.defineFlow(
  {
    name: 'evaluateRoleplayPerformanceFlow',
    inputSchema: RoleplayEvaluationInputSchema,
    outputSchema: RoleplayEvaluationOutputSchema,
  },
  async (input) => {
    const { output } = await evaluationPrompt(input);
    if (!output) {
      throw new Error('Failed to get evaluation from the prompt.');
    }
    return { evaluation: output.evaluation };
  }
);

export async function evaluateRoleplayPerformance(input: RoleplayEvaluationInput): Promise<RoleplayEvaluationOutput> {
  return evaluateRoleplayPerformanceFlow(input);
}
