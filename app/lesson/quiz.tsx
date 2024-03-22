"use client";

import { challengeOptions, challenges } from "@/db/schema";
import { useState, useTransition } from "react";
import Header from "./header";
import QuestionBubble from "./question-bubble";
import Challenge from "./challenge";
import Footer from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
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
  const [pending, startTransition] = useTransition();
  //  states

  const [hearts, setHearts] = useState(intialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);
  const [challenges] = useState(initialLessonChallenges);
  const [activeIndex, setActiveIndex] = useState(() => {
    const unCompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    return unCompletedIndex === -1 ? 0 : unCompletedIndex;
  });
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
  const [selectedOption, setSelectedOption] = useState<number>();
  const currentChallenge = challenges[activeIndex];
  const currentOptions = currentChallenge.challengeOptions ?? [];
  const title =
    currentChallenge.type === "ASSIST"
      ? "Select the correct Meaning"
      : currentChallenge.question;

  // functions

  const onSelect = (id: number) => {
    if (status !== "none") {
      return;
    }
    setSelectedOption(id);
  };

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onContinue = () => {
    if (!selectedOption) {
      return;
    }
    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }
    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }
    const correctOptions = currentOptions.find((option) => option.correct);
    if (!correctOptions) {
      return;
    }
    if (correctOptions && correctOptions.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(currentChallenge.id).then((response) => {
          if (response?.error === "hearts") {
            console.log("Missing hearts");
            return;
          }
          setStatus("correct");
          setPercentage((prev) => prev + 100 / challenges.length);
        });
      });
      setStatus("correct");
    } else {
      console.log("incorrect");
      setStatus("wrong");
    }
  };
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
              <Challenge
                options={currentOptions}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={false}
                type={currentChallenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer disabled={!selectedOption} status={status} onCheck={onContinue} />
    </>
  );
};

export default Quiz;
