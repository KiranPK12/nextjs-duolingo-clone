"use client";

import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { useState, useTransition } from "react";
import Header from "./header";
import QuestionBubble from "./question-bubble";
import Challenge from "./challenge";
import Footer from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useWindowSize, useMount } from "react-use";
import Image from "next/image";
import ResultCard from "./ResultCard";
import { useRouter } from "next/navigation";

import Confetti from "react-confetti";
import { useHeartsModal } from "@/store/use-heart-modal";
import { usePractiseModal } from "@/store/use-practise-modal";

type Props = {
  initialLessonId: number;
  intialHearts: number;
  intialPoints: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  initialPercentage: number;
  userSubscription:
    | (typeof userSubscription.$inferSelect & { isActive: boolean })
    | null;
};
const Quiz = ({
  initialLessonId,
  intialHearts,
  intialPoints,
  userSubscription,
  initialPercentage,
  initialLessonChallenges,
}: Props) => {
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPractiseModal } = usePractiseModal();

  useMount(() => {
    if (initialPercentage === 100) {
      openPractiseModal();
    }
  });
  const { height, width } = useWindowSize();
  const router = useRouter();
  const [correctAudio, state_1, correctAudioControls] = useAudio({
    src: "/correct.wav",
  });
  const [incorrectAudio, state_2, incorrectAudioControls] = useAudio({
    src: "/incorrect.wav",
  });
  const [finishAudio, state_3, finishControls] = useAudio({
    src: "/finish.mp3",
    autoPlay: true,
  });
  const [pending, startTransition] = useTransition();
  //  states
  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(intialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });

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

  if (!currentChallenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={1000}
          width={width}
          height={height}
        />
        <div className="flex flex-col gap-y-4 lg:gap-8 max-w-lg mx-auto items-center text-center justify-center h-full">
          <Image
            src={"/finish.svg"}
            alt="Finish"
            className="hidden lg:block"
            height={100}
            width={100}
          />
          <Image
            src={"/finish.svg"}
            alt="Finish"
            className="block lg:hidden"
            height={50}
            width={50}
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Great Job! <br /> You&apos;ve completed the lesson.
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard
              variant="hearts"
              value={hearts}
              hasSubscription={!!userSubscription?.isActive}
            />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }
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
        upsertChallengeProgress(currentChallenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              return;
            }
            correctAudioControls.play();
            setStatus("correct");
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            setPercentage((prev) => prev + 100 / challenges.length);
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong. Try again Later"));
      });
      setStatus("correct");
    } else {
      startTransition(() => {
        reduceHearts(currentChallenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              console.log("missing hearts");

              return;
            }

            incorrectAudioControls.play();
            setStatus("wrong");
            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    }
  };
  return (
    <>
      {incorrectAudio}
      {correctAudio}
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
                disabled={pending}
                type={currentChallenge.type}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};

export default Quiz;
