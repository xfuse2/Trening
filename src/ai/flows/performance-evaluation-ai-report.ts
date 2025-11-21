'use server';
/**
 * @fileOverview An AI agent to generate performance evaluation reports.
 *
 * - generateAiReport - A function that generates a performance evaluation report.
 * - GenerateAiReportInput - The input type for the generateAiReport function.
 * - GenerateAiReportOutput - The return type for the generateAiReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiReportInputSchema = z.object({
  roleTitle: z.string().describe('The job title of the employee.'),
  finalScore: z.number().describe('The final performance score of the employee.'),
  scoresDetails: z.string().describe('Details of the scores for each evaluation criteria.'),
});
export type GenerateAiReportInput = z.infer<typeof GenerateAiReportInputSchema>;

const GenerateAiReportOutputSchema = z.object({
  aiReport: z.string().describe('The AI-generated performance evaluation report.'),
  smartGoals: z.string().describe('Proposed SMART goals for the employee.'),
});
export type GenerateAiReportOutput = z.infer<typeof GenerateAiReportOutputSchema>;

export async function generateAiReport(input: GenerateAiReportInput): Promise<GenerateAiReportOutput> {
  return generateAiReportFlow(input);
}

const generateAiReportPrompt = ai.definePrompt({
  name: 'generateAiReportPrompt',
  input: {schema: GenerateAiReportInputSchema},
  output: {schema: GenerateAiReportOutputSchema},
  prompt: `You are an expert HR manager.

Write a performance evaluation report for a {{roleTitle}}. The final score is {{finalScore}}/5. The score details are as follows: {{scoresDetails}}.

Part 1: Summarize the performance, including strengths and weaknesses.

Part 2: Propose 3 SMART goals for the next month to improve the weaknesses mentioned in the evaluation. Make them specific and measurable.

Separate Part 1 and Part 2 with "---".`,
});

const generateAiReportFlow = ai.defineFlow(
  {
    name: 'generateAiReportFlow',
    inputSchema: GenerateAiReportInputSchema,
    outputSchema: GenerateAiReportOutputSchema,
  },
  async input => {
    const {output} = await generateAiReportPrompt(input);
    if (!output) {
      throw new Error('No output from generateAiReportPrompt');
    }
    return output;
  }
);
