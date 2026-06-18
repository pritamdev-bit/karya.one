import { corsair } from "@/src/server/corsair";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "../utils/rateLimit";

interface GoogleCalendarEvent {
    id?: string;
    summary?: string;
    description?: string;
    start: { date?: string; dateTime?: string };
    end: { date?: string; dateTime?: string };
    htmlLink?: string;
    status?: string;
    transparency?: string;
    organizer?: { email?: string };
    conferenceData?: { entryPoints?: { uri?: string }[] };
}

function mapEvent(event: GoogleCalendarEvent) {
    const isAllDay = !!event.start.date;
    const date = event.start.date ?? event.start.dateTime?.split("T")[0] ?? "";
    const startTime = isAllDay
        ? "00:00"
        : (event.start.dateTime ?? "").split("T")[1]?.slice(0, 5) ?? "00:00";
    const endTime = isAllDay
        ? "23:59"
        : (event.end.dateTime ?? "").split("T")[1]?.slice(0, 5) ?? "23:59";

    const meetingLink =
        event.conferenceData?.entryPoints?.[0]?.uri ?? undefined;

    return {
        id: event.id ?? crypto.randomUUID(),
        title: event.summary ?? "Untitled",
        date,
        startTime,
        endTime,
        color: "blue",
        description: event.description ?? undefined,
        meetingLink,
    };
}

export async function GET(request: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { allowed } = checkRateLimit(userId, 10, 60_000);
    if (!allowed) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const response = await corsair.withTenant(`${userId}`).googlecalendar.api.events.getMany({
        timeMin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
        timeMax: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
    });

    const rawItems = (response.items ?? []) as unknown as GoogleCalendarEvent[];
    const events = rawItems.filter((e) => e.id).map(mapEvent);

    return NextResponse.json({
        message: "Success",
        events,
    });
}
