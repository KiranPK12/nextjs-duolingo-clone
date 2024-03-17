"use client";
import { courses } from "@/db/schema";
import React from "react";
import { Card } from "./Card";
type Props = {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId: number;
};

const List = ({ activeCourseId, courses }: Props) => {
  return (
    <div className="pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          active={activeCourseId == course.id}
          onClick={() => {}}
          disabled={false}
        />
      ))}
    </div>
  );
};

export default List;
