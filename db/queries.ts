import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { courses, units, userProgress } from "./schema";

export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();
  return data;
});

export const getUserProgress = cache(async () => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  });
  return data;
});

export const getUnits = cache(async () => {
  const userProgress = await getUserProgress();
  if (!userProgress?.activeCourseId) {
    return [];
  }

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: true,
            },
          },
        },
      },
    },
  });
  // console.log(data);
  // const normalisedFunction = data.map(unit=>{
  //   const lessonWithCompletedStatus = unit.lessons.map(lesson=>{
  //     const allCompletedChallenges = lesson.challenges.every(challenge)
  //   })
  // })
});

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    // TODO:populate units and lessons
  });

  return data;
});
