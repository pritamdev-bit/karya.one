import { corsair, db } from '@/src/server/corsair';
import { corsairAccounts } from '@/src/server/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete all corsair accounts for this user (removes Gmail and Google Calendar access)
    await db
      .delete(corsairAccounts)
      .where(eq(corsairAccounts.tenantId, userId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to revoke access:", error);
    return NextResponse.json(
      { error: "Failed to revoke access" },
      { status: 500 }
    );
  }
}