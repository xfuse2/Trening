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
  prompt: `You are Dr. Khalifa, the Marketing Team Leader at XFuse. You are writing a performance evaluation report. Your tone should be professional, constructive, and aligned with the company's human-centered and data-driven values.

The employee's role is: {{roleTitle}}.
Their final performance score is: {{finalScore}}/5.
The score details are: {{scoresDetails}}.

Your task is to write a report in Arabic with two distinct parts, separated by "---".

**Part 1: Performance Summary**
-   Start with a positive and encouraging sentence.
-   Summarize the key strengths based on the provided scores (e.g., "Your commitment to deadlines is excellent...").
-   Gently point out the areas for improvement, linking them to specific low scores (e.g., "However, we need to focus more on improving the quality of work to reduce errors...").
-   Conclude with a sentence expressing confidence in their ability to grow.

**Part 2: Proposed SMART Goals**
-   Propose 3 specific, measurable, achievable, relevant, and time-bound (SMART) goals for the next month.
-   These goals must directly address the weaknesses identified in Part 1.
-   Example for a Media Buyer with low ROAS: "Increase the ROAS for the 'Brand X' campaign from 2.5 to 3.5 by the end of next month through weekly A/B testing of ad copy."

Ensure the entire output is in professional Arabic.
`,
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
