import { corsair, db } from "@/src/server/corsair";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isStaleData } from "../utils/checkStaleData";
import { checkRateLimit } from "../utils/rateLimit";
import { corsairEntities, corsairEvents } from "@/src/server/db/schema";

function isCalendarInvite(email: any): boolean {
    if (email.payload?.mimeType === "text/calendar") return true;
    const subject = email.payload?.headers?.find((h: any) => h.name === "Subject")?.value ?? "";
    return /invitation|invited|accepted|declined|tentative/i.test(subject);
}

export async function GET(request: NextRequest) {
    const { userId } = await auth();
    const searchParams = request.nextUrl.searchParams;
    const nextPageToken = searchParams.get("nextPageToken") ?? "";

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { allowed } = checkRateLimit(userId, 10, 60_000);
    if (!allowed) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const responseDBList = await corsair.withTenant(`${userId}`).gmail.db.messages.list({});
    const sortedResponseDBList = responseDBList.sort((a, b) => {
        return Number(b.data.internalDate) - Number(a.data.internalDate);
    })

    // console.log(sortedResponseDBList)
    const totalCount = await corsair.withTenant(`${userId}`).gmail.db.messages.count();

    if (responseDBList.length === 0 || nextPageToken) {
        const responseList = await corsair.withTenant(`${userId}`).gmail.api.messages.list({
            maxResults: 30,
            ...(nextPageToken && { pageToken: nextPageToken }),
        });
        const data = responseList.messages ?? [];
        const NewNextPageToken = responseList.nextPageToken ?? "";

        const responseEmails = await Promise.all(
            data.map((element) =>
                corsair.withTenant(`${userId}`).gmail.api.messages.get({
                    id: element.id as string,
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
                isCalendar: isCalendarInvite(email),
            }
        })

        return NextResponse.json({
            message: "Data is getting fetched for the first time",
            emails,
            nextPageToken: NewNextPageToken,
        });
    }

    // if data is stale, refetch
    if (isStaleData(`${responseDBList[0].updated_at}`)) {
        await db.delete(corsairEntities);
        await db.delete(corsairEvents);
        const responseList = await corsair.withTenant(`${userId}`).gmail.api.messages.list({
            maxResults: 30,
            pageToken: nextPageToken,
        });

        const data = responseList.messages ?? [];
        const NewNextPageToken = responseList.nextPageToken ?? "";

        const responseEmails = await Promise.all(
            data.map((element) =>
                corsair.withTenant(`${userId}`).gmail.api.messages.get({
                    id: element.id as string,
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
                isCalendar: isCalendarInvite(email),
            }
        })

        return NextResponse.json({
            message: "Data is stale, refetching",
            emails,
            nextPageToken: NewNextPageToken,
        });
    }

        const emails = sortedResponseDBList.map((email) => {
            return {
                id: email.data.id,
                sender: email.data.payload?.headers?.find((header: any) => header.name === "From")?.value,
                subject: email.data.payload?.headers?.find((header: any) => header.name === "Subject")?.value,
                snippet: email.data.snippet,
                time: new Date(parseInt(`${email.data.internalDate}`)).toLocaleString(),
                unread: email.data.labelIds?.includes("UNREAD"),
                isCalendar: isCalendarInvite(email.data),
            }
        })

    return NextResponse.json({
        message: "Data is fresh",
        emails,
        totalCount,
        nextPageToken: "",
    });

}