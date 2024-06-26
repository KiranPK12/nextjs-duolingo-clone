import FeedWrapper from "@/components/feed-wrapper";
import StickyWrapper from "@/components/stricky-wrapper";
import { UserProgress } from "@/components/user-progress";
import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Promo from "@/components/promo";
import Quests from "@/components/quests";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboards",
  description: "Learn and Master Multiple languages",
};

const LeaderboardPage = async () => {
  const userProgressdata = getUserProgress();
  const userSubscriptiondata = getUserSubscription();
  const topTenUsersData = getTopTenUsers();
  const [userProgress, userSubscription, topTenUsers] = await Promise.all([
    userProgressdata,
    userSubscriptiondata,
    topTenUsersData,
  ]);
  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={!!userSubscription?.isActive}
        />
        {!!!userSubscription?.isActive && <Promo />}
        <Quests points={userProgress.points} />

      </StickyWrapper>
      <FeedWrapper>
        <div className="w-full flex flex-col items-center">
          <Image
            src={"/leaderboard.svg"}
            alt="leaderbaord"
            height={90}
            width={90}
          />
          <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
            Leaderboard
          </h1>
          <p className="text-muted-foreground text-center text-lg mb-6">
            See where you stand among other learners in the community
          </p>
          <Separator className="mb-4 h-0.5 rounded-full" />

          {topTenUsers.map((userProgress, index) => (
            <div
              className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/5"
              key={index}
            >
              <p className="font-bold text-lime-700 mr-4">{index + 1}</p>
              <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6 ">
                <AvatarImage
                  src={userProgress.userImageSrc}
                  className="object-cover"
                />
              </Avatar>
              <p className="font-bold text-neutral-800 flex-1">
                {userProgress.userName}
              </p>
              <p className="text-muted-foreground">{userProgress.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderboardPage;
