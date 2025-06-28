import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import { useEffect, useState } from "react";
import { ReactNode } from "react";
import { Picker } from "emoji-mart";

interface EmojiPopoverProps {
  children: ReactNode;
  label: string;
  onEmojiSelect: (emoji: any) => void;
}

const EmojiPopover = ({
  children,
  label,
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
  if (!open) return;

  const timeoutId = setTimeout(() => {
    const pickerContainer = document.querySelector(".emoji-picker-container");

    if (!pickerContainer) return;


    const picker = new Picker({
      onEmojiSelect,
      theme: "light",
    });

    pickerContainer.appendChild(picker);
  }, 0);

  return () => {
    clearTimeout(timeoutId);
    const pickerContainer = document.querySelector(".emoji-picker-container");
    if (pickerContainer) pickerContainer.innerHTML = "";
  };
}, [open]);


  return (
    <TooltipProvider>
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
        <PopoverContent  className="emoji-picker-container w-fit h-fit">
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default EmojiPopover;
