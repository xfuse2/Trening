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
