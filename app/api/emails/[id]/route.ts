import { corsair } from "@/src/server/corsair";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "../../utils/rateLimit";

function decodeBase64url(data: string): string {
    return Buffer.from(data, "base64url").toString("utf-8");
}

function decodeHtmlEntities(str: string): string {
    return str
        .replace(/&nbsp;/g, " ")
        .replace(/&zwnj;/g, "\u200C")
        .replace(/&zwj;/g, "\u200D")
        .replace(/&mdash;/g, "\u2014")
        .replace(/&ndash;/g, "\u2013")
        .replace(/&rsquo;/g, "\u2019")
        .replace(/&lsquo;/g, "\u2018")
        .replace(/&rdquo;/g, "\u201D")
        .replace(/&ldquo;/g, "\u201C")
        .replace(/&hellip;/g, "\u2026")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function extractBody(payload: any): { text: string; html: string } {
    let text = "";
    let html = "";

    const walk = (node: any) => {
        if (!node) return;
        if (node.mimeType === "text/plain" && node.body?.data) {
            text += decodeBase64url(node.body.data);
        } else if (node.mimeType === "text/html" && node.body?.data) {
            html += decodeBase64url(node.body.data);
        }
        if (node.parts) {
            for (const part of node.parts) {
                walk(part);
            }
        }
    };

    walk(payload);
    return { text, html };
}

function extractAttachments(payload: any): { filename: string; mimeType: string; size: number; attachmentId: string }[] {
    const attachments: { filename: string; mimeType: string; size: number; attachmentId: string }[] = [];

    const walk = (node: any) => {
        if (!node) return;
        if (node.filename && node.body?.attachmentId) {
            attachments.push({
                filename: node.filename,
                mimeType: node.mimeType ?? "application/octet-stream",
                size: node.body.size ?? 0,
                attachmentId: node.body.attachmentId,
            });
        }
        if (node.parts) {
            for (const part of node.parts) {
                walk(part);
            }
        }
    };

    walk(payload);
    return attachments;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { allowed } = checkRateLimit(userId, 20, 60_000);
    if (!allowed) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;

    const email = await corsair.withTenant(`${userId}`).gmail.api.messages.get({
        id,
    });

    const headers = email.payload?.headers ?? [];
    const getHeader = (name: string) =>
        headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";

    const { text, html } = extractBody(email.payload);
    const attachments = extractAttachments(email.payload);

    return NextResponse.json({
        id: email.id,
        threadId: email.threadId,
        sender: getHeader("From"),
        to: getHeader("To"),
        subject: getHeader("Subject"),
        date: getHeader("Date"),
        snippet: email.snippet,
        body: decodeHtmlEntities(html || text),
        bodyHtml: html || undefined,
        attachments,
        labels: email.labelIds,
        isCalendar: email.payload?.mimeType === "text/calendar" ||
            /invitation|invited|accepted|declined|tentative/i.test(getHeader("Subject")),
    });
}
