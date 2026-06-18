import { Agent, tool, OpenAIProvider, setDefaultModelProvider, setTracingDisabled } from '@openai/agents';
import { OpenAIAgentsProvider } from '@corsair-dev/mcp';
import OpenAI from 'openai';
import { corsair } from './corsair';

let initialized = false;

function ensureInitialized() {
    if (initialized) return;
    setTracingDisabled(true);

    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL ?? process.env.BASE_URL,
    });

    setDefaultModelProvider(
        new OpenAIProvider({
            openAIClient: client,
            useResponses: false,
            cacheResponsesWebSocketModels: false,
        })
    );

    initialized = true;
}

interface AiAgentOptions {
    tenantId: string;
    emails?: { id: string; sender: string; subject: string; snippet: string }[];
    events?: { title: string; date: string; startTime: string; endTime: string }[];
    history?: { role: 'user' | 'assistant'; content: string }[];
}

export function createAiAgent({ tenantId, emails, events, history }: AiAgentOptions) {
    const provider = new OpenAIAgentsProvider();
    const tools = provider.build({ corsair: corsair.withTenant(tenantId), tool });
    ensureInitialized();

    const contextParts: string[] = [];
    if (history?.length) {
        contextParts.push(`Previous conversation:\n${history.map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}`);
    }
    if (emails?.length) {
        contextParts.push(`Recent emails:\n${emails.slice(0, 10).map((e) => `- From: ${e.sender} | Subject: ${e.subject} | Preview: ${e.snippet}`).join('\n')}`);
    }
    if (events?.length) {
        contextParts.push(`Today's schedule:\n${events.map((e) => `- ${e.title} on ${e.date} from ${e.startTime} to ${e.endTime}`).join('\n')}`);
    }
    const contextBlock = contextParts.length ? `\n\nCurrent user context:\n${contextParts.join('\n\n')}` : '';

    return new Agent({
        name: 'karya-ai',
        model: 'deepseek-v4-flash',
        instructions: `You are Karya AI, a helpful assistant in the KARYA.ONE productivity app. You help users manage their Gmail and Google Calendar. You can read, search, and summarize emails, draft and send email replies, list, create, update, or delete calendar events, and check today's schedule or find free slots. When using tools, always reference resources by their ID, not their name. Be concise and helpful.${contextBlock}`,
        tools,
    });
}
