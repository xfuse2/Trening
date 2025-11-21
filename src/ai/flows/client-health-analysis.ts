'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing client health based on feedback and metrics.
 *
 * The flow uses a prompt to generate insights and action plans for improving client relationships and satisfaction.
 *
 * @file exports:
 *   - `analyzeClientHealth` - An async function that takes client data as input and returns an analysis result.
 *   - `ClientHealthInput` - The TypeScript type definition for the input to the analyzeClientHealth function.
 *   - `ClientHealthOutput` - The TypeScript type definition for the output of the analyzeClientHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClientHealthInputSchema = z.object({
  name: z.string().describe('The name of the client.'),
  package: z.string().describe('The package the client is subscribed to.'),
  health: z.number().describe('The health score of the client (out of 10).'),
  feedback: z.string().describe('The latest feedback from the client.'),
});
export type ClientHealthInput = z.infer<typeof ClientHealthInputSchema>;

const ClientHealthOutputSchema = z.object({
  analysis: z.string().describe('AI analysis of the client health, including concerns and action plan.'),
});
export type ClientHealthOutput = z.infer<typeof ClientHealthOutputSchema>;

export async function analyzeClientHealth(input: ClientHealthInput): Promise<ClientHealthOutput> {
  return analyzeClientHealthFlow(input);
}

const clientHealthPrompt = ai.definePrompt({
  name: 'clientHealthPrompt',
  input: {schema: ClientHealthInputSchema},
  output: {schema: ClientHealthOutputSchema},
  prompt: `You are an expert CRM (Customer Relationship Management) consultant and senior Account Manager at XFuse, a digital solutions agency in Egypt. Our core value is being "human-centered" and building long-term partnerships.

Analyze the following client situation:
- Client: {{name}}
- Package: {{package}}
- Health Score: {{health}}/10
- Last Feedback: "{{feedback}}"

Your output must be in professional Arabic and structured as follows:

**1. تحليل نفسي موجز لمشاعر العميل:**
(What is the client *really* worried about? Is it money, results, feeling neglected? Go beyond the surface-level feedback.)

**2. خطة عمل فورية (خطوتين):**
(Propose two specific, actionable steps to regain their trust or boost their satisfaction. The steps should be practical and align with XFuse's systematic approach. For example, instead of "talk to them," suggest "Schedule a 15-min audit call to review the campaign funnel and identify bottlenecks.")

Make the response concise, direct, and empathetic.
`,
});

const analyzeClientHealthFlow = ai.defineFlow(
  {
    name: 'analyzeClientHealthFlow',
    inputSchema: ClientHealthInputSchema,
    outputSchema: ClientHealthOutputSchema,
  },
  async input => {
    const {output} = await clientHealthPrompt(input);
    return output!;
  }
);
