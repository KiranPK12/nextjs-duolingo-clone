"use server";

import db from "@/db/drizzle";
import { getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const upsertChallengeProgress = async (challengeId: number) => {
    const { userId } = auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("user progress not found");
    }

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId),
    });

    if (!challenge) {
        throw new Error("No challenges found");
    }

    const lessonId = challenge.lessonId;
    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId)
        ),
    });
    const isPractise = !!existingChallengeProgress
    // TODO:not if user has a subscription
    if (currentUserProgress.hearts === 0 && !isPractise) {
        return { error: "hearts" }
    }
    if (isPractise) {
        await db.update(challengeProgress).set({
            completed: true
        }).where(eq(challengeProgress.id, existingChallengeProgress.id))
        await db.update(userProgress).set({
            hearts: Math.min(currentUserProgress.hearts + 1, 5),
            points: currentUserProgress.hearts + 10
        }).where(eq(userProgress.userId, userId))
        revalidatePath("/learn")
        revalidatePath("/lesson")
        revalidatePath("/quests")
        revalidatePath("/leaderboards")
        revalidatePath(`/lesson/${lessonId}`)
        return;
    }
    await db.insert(challengeProgress).values({
        challengeId, userId, completed: true
    })

    await db.update(userProgress).set({
        points: currentUserProgress.points + 10,
    }).where(eq(userProgress.userId, userId))
    revalidatePath("/learn")
    revalidatePath("/lesson")
    revalidatePath("/quests")
    revalidatePath("/leaderboards")
    revalidatePath(`/lesson/${lessonId}`)


};