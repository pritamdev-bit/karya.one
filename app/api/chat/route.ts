import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { run } from '@openai/agents';
import { createAiAgent } from '@/src/server/ai';

export async function POST(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const body = await request.json();
    const { message, history, emails, events } = body as {
        message: string;
        history?: { role: 'user' | 'assistant'; content: string }[];
        emails?: { id: string; sender: string; subject: string; snippet: string }[];
        events?: { title: string; date: string; startTime: string; endTime: string }[];
    };

    if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const agent = createAiAgent({ tenantId: userId, emails, events, history });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            try {
                const result = await run(agent, message, { stream: true });

                for await (const event of result) {
                    if (event.type === 'raw_model_stream_event') {
                        const data = event.data;
                        if (data.type === 'output_text_delta') {
                            controller.enqueue(
                                encoder.encode(`data: ${JSON.stringify({ type: 'text', content: data.delta })}\n\n`)
                            );
                        }
                    } else if (event.type === 'run_item_stream_event') {
                        if (event.name === 'tool_called') {
                            const item = event.item as { rawItem?: { name?: string } };
                            controller.enqueue(
                                encoder.encode(
                                    `data: ${JSON.stringify({
                                        type: 'tool_call',
                                        tool: item.rawItem?.name ?? 'unknown',
                                    })}\n\n`
                                )
                            );
                        }
                    }
                }

                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
                controller.close();
            } catch (err: unknown) {
                const errorMsg = err instanceof Error ? err.message : 'Agent run failed';
                console.error('AI agent error:', err);
                controller.enqueue(
                    encoder.encode(
                        `data: ${JSON.stringify({ type: 'error', content: errorMsg })}\n\n`
                    )
                );
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    });
}
