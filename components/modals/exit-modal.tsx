"use client";

import { useExitModal } from "@/store/use-exit-modal";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
export const ExitModal = () => {
  const router = useRouter();
  const [isclient, setIsClient] = useState(false);
  const { isOpen, open, close } = useExitModal();
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isclient) {
    return null;
  }
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center justify-center w-full mb-5">
            <Image
              src={"/mascot_sad.svg"}
              alt="Mascot"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            Wait , Don&apos;t Go!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            You&apos;re about to leave the lesson
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="w-full flex flex-col gap-y-4">
            <Button
              variant="primary"
              className="w-full"
              size={"lg"}
              onClick={close}
            >
              Keep Learning
            </Button>
            <Button
              variant="dangerOutline"
              className="w-full"
              size={"lg"}
              onClick={() => {
                close();
                router.push("/learn");
              }}
            >
              End Session
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
