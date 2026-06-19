import { corsair } from "@/src/server/corsair";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { userId } = await auth();
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("q") ?? "";

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await corsair.withTenant(`${userId}`).gmail.api.messages.list({
        q: `${searchQuery}`,
        maxResults: 10,
    });

    const data = response.messages ?? [];
    
    const responseEmails = await Promise.all(
        data.map((element) =>
            corsair.withTenant(`${userId}`).gmail.api.messages.get({
                id: element.id as string,
                format: "metadata"
            })
        )
    );

    const emails = responseEmails.map((email) => {
        return {
            id: email.id,
            sender: email.payload?.headers?.find((header) => header.name === "From")?.value,
            subject: email.payload?.headers?.find((header) => header.name === "Subject")?.value,
            snippet: email.snippet,
            time: new Date(parseInt(`${email.internalDate}`)).toLocaleString(),
            unread: email.labelIds?.includes("UNREAD"),
            isCalendar: false,
        }
    })

    return NextResponse.json({
        message: "Search query is successful",
        emails,
    });
}