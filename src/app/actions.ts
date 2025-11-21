
'use server';

import {
  generateTemplate as runGenerateTemplate,
  type GenerateTemplateInput,
  type GenerateTemplateOutput,
} from '@/ai/flows/ai-template-generator';
import {
  analyzeClientHealth as runAnalyzeClientHealth,
  type ClientHealthInput,
  type ClientHealthOutput,
} from '@/ai/flows/client-health-analysis';
import {
  aiRoleAssistant as runAiRoleAssistant,
  type AiRoleAssistantInput,
  type AiRoleAssistantOutput,
} from '@/ai/flows/ai-role-assistant';
import {
  generateAiReport as runGenerateAiReport,
  type GenerateAiReportInput,
  type GenerateAiReportOutput,
} from '@/ai/flows/performance-evaluation-ai-report';
import {
  interactiveRoleplay as runInteractiveRoleplay,
  type InteractiveRoleplayInput,
  type InteractiveRoleplayOutput,
} from '@/ai/flows/interactive-roleplay-flow';

export async function generateTemplate(
  input: GenerateTemplateInput
): Promise<GenerateTemplateOutput> {
  return await runGenerateTemplate(input);
}

export async function analyzeClientHealth(
  input: ClientHealthInput
): Promise<ClientHealthOutput> {
  return await runAnalyzeClientHealth(input);
}

export async function aiRoleAssistant(
  input: AiRoleAssistantInput
): Promise<AiRoleAssistantOutput> {
  return await runAiRoleAssistant(input);
}

export async function generateAiReport(
  input: GenerateAiReportInput
): Promise<GenerateAiReportOutput> {
  const result = await runGenerateAiReport(input);
  const [aiReport = '', smartGoals = ''] = result.aiReport.split('---');
  return { ...result, aiReport, smartGoals };
}

export async function interactiveRoleplay(
  input: InteractiveRoleplayInput
): Promise<InteractiveRoleplayOutput> {
    const response = await runInteractiveRoleplay(input);

    // The genkit flow is designed to give feedback on every user turn.
    // If there is no user message, it's the start of the conversation, so there's no feedback.
    if (!input.userMessage) {
        return {
            ...response,
            feedback: undefined,
        };
    }
    
    return response;
}
