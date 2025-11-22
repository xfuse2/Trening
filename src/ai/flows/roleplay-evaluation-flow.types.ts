import {z} from 'genkit';

export const RoleplayEvaluationInputSchema = z.object({
  scenario: z
    .string()
    .describe('The description of the scenario that the user was playing.'),
  history: z
    .array(z.object({role: z.enum(['ai', 'user']), text: z.string()}))
    .describe('The entire history of messages in the roleplay.'),
});
export type RoleplayEvaluationInput = z.infer<typeof RoleplayEvaluationInputSchema>;


export const RoleplayEvaluationOutputSchema = z.object({
  evaluation: z
    .string()
    .describe('A comprehensive evaluation of the user\'s performance, written in markdown.'),
});
export type RoleplayEvaluationOutput = z.infer<typeof RoleplayEvaluationOutputSchema>;
