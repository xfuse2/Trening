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
  prompt: `You are an expert CRM (Customer Relationship Management) consultant.

Analyze the following client situation in a marketing agency:
- Client: {{name}}
- Package: {{package}}
- Health Score: {{health}}/10
- Last Feedback: "{{feedback}}"

Required (in Arabic):
1.  Brief psychological analysis of the client\'s feelings (what are they really worried about?).
2.  Immediate action plan of 2 steps to regain their trust or boost their satisfaction.

Make the response concise and direct.
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
