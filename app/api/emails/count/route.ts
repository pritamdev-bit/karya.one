import { corsair } from "@/src/server/corsair";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await corsair.withTenant(`${userId}`).gmail.api.messages.list({
        maxResults: 1,
    });

    return NextResponse.json({ total: res.resultSizeEstimate ?? 0 });
}
