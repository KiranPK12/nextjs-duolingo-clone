import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
type Props = {
  variant: "points" | "hearts";
  value: number;
};

const ResultCard = ({ value, variant }: Props) => {
  const imgSrc = variant === "points" ? "/points.svg" : "/heart.svg";
  return (
    <div
      className={cn(
        "rounded-2xl border-2 w-full",
        variant === "points" && "bg-orange-400 border-orange-400",
        variant === "hearts" && "bg-rose-400 border-rose-400"
      )}
    >
      <div
        className={cn(
          "p-1.5 text-white rounded-t-xl font-bold text-center uppercase text-sm",
          variant === "hearts" && "bg-rose-500",
          variant === "points" && "bg-orange-400"
        )}
      >
        {variant === "hearts" ? "Hearts Left" : "Total XP earned"}
      </div>
      <div
        className={cn(
          "rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg",
          variant === "points" && "text-orange-400",
          variant === "hearts" && "text-rose-400"
        )}
      >
        <Image
          src={imgSrc}
          alt="icon"
          className="mr-1.5"
          height={30}
          width={30}
        />
        {value}
      </div>
    </div>
  );
};

export default ResultCard;
