"use client";

import { challengeOptions, challenges, lessons } from "@/db/schema";
import { useState } from "react";
import Header from "./header";
import QuestionBubble from "./question-bubble";

type Props = {
  initialLessonId: number;
  intialHearts: number;
  intialPoints: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  initialPercentage: number;
  userSubscription: any;
};
const Quiz = ({
  initialLessonId,
  intialHearts,
  intialPoints,
  userSubscription,
  initialPercentage,
  initialLessonChallenges,
}: Props) => {
  const [hearts, setHearts] = useState(intialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const unCompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return unCompletedIndex === -1 ? 0 : unCompletedIndex;
  });
  const currentChallenge = challenges[activeIndex];
  const currentOptions = currentChallenge.challengeOptions ?? [];
  const title =
    currentChallenge.type === "ASSIST"
      ? "Select the correct Meaning"
      : currentChallenge.question;

  return (
    <>
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {title}
            </h1>
            <div className="">
              {currentChallenge.type === "ASSIST" && (
                <QuestionBubble question={currentChallenge.question} />
              )}
              <Challenge options={options} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;
