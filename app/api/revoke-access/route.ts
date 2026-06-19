import { corsair, db } from '@/src/server/corsair';
import { corsairAccounts, corsairEntities, corsairEvents } from '@/src/server/db/schema';
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

    // Get account IDs for this user
    const accounts = await db
      .select({ id: corsairAccounts.id })
      .from(corsairAccounts)
      .where(eq(corsairAccounts.tenantId, userId));

    // Delete all child rows first
    for (const account of accounts) {
      await db.delete(corsairEntities).where(eq(corsairEntities.accountId, account.id));
      await db.delete(corsairEvents).where(eq(corsairEvents.accountId, account.id));
    }

    // Now delete the accounts
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