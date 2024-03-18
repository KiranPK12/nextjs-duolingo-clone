import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";

type Props = {
  id: number;
  title: string;
  imageSrc: string;
  onClick: (id: number) => void;
  active?: boolean;
  disabled?: boolean;
};
export const Card = ({
  id,
  title,
  imageSrc,
  disabled,
  active,
  onClick,
}: Props) => {
  return (
    <div
      className={cn(
        "h-full border-2 rounded-xl border-b-[4px] hover:bg-black/5 active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[200px]",
        disabled && "pointer-events-none opacity-50"
      )}
      onClick={() => onClick(id)}
    >
      <div className="min-h-[24px] w-full flex items-center justify-end">
        {active && (
          <div className="rounded-md bg-green-600 flex items-center justify-center p-1.5">
            <Check className="text-white stroke-[4] h-4 w-4" />
          </div>
        )}
      </div>
      <Image src={imageSrc} width={93.33} height={70} alt={title} className="rounded-lg drop-shadow-md border object-cover" />
      <p className="text-neutral-700 text-center font-bold mt-3">{title}</p>
    </div>
  );
};
