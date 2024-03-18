"use client";
import { courses, userProgress } from "@/db/schema";
import React, { useTransition } from "react";
import { Card } from "./Card";
import { useRouter } from "next/navigation";
import { upsertUserProgress } from "@/actions/user-progress";
import { toast } from "sonner";
type Props = {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

const List = ({ activeCourseId, courses }: Props) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const onClick = (id: number) => {
    if (pending) return;
    if (id === activeCourseId) {
      return router.push("/learn");
    }
    startTransition(() => {
      upsertUserProgress(id).catch(()=>toast.error("Something Went Wrong"));
    });
  };
  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          active={activeCourseId == course.id}
          onClick={onClick}
          disabled={false}
        />
      ))}
    </div>
  );
};

export default List;
