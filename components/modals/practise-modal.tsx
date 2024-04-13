"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { usePractiseModal } from "./../../store/use-practise-modal";
export const PractiseModal = () => {
  const router = useRouter();
  const [isclient, setIsClient] = useState(false);
  const { isOpen, open, close } = usePractiseModal();
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onClick = () => {
    close();
  };
  if (!isclient) {
    return null;
  }
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-center w-full mb-5">
            <Image src={"/heart.svg"} alt="Heart" height={80} width={80} />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            Practise lesson
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Use practise lesson to regain hearts and points. You cannot loose
            hearts or points in practise lessons
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="w-full flex flex-col gap-y-4">
            <Button
              variant="primary"
              className="w-full"
              size={"lg"}
              onClick={onClick}
            >
              I understand
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
