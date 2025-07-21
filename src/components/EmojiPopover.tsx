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

import { useRef, useState } from "react";
import { ReactNode } from "react";
import Picker, { EmojiClickData } from "emoji-picker-react"

interface EmojiPopoverProps {
  children: ReactNode;
  label: string;
  onEmojiSelect: (emoji: string) => void;
}

const EmojiPopover = ({
  children,
  label,
  onEmojiSelect,
}: EmojiPopoverProps) => {

  const [open,setOpen] = useState(false)
  const TimeOutID = useRef<null | NodeJS.Timeout>(null)

  function onSelect(data:EmojiClickData){
    clearTimeout(TimeOutID.current)

    onEmojiSelect(data.emoji)

    TimeOutID.current = setTimeout(() => {
      setOpen(false)
    },500)
  }

  return (
    <TooltipProvider >
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
        <PopoverContent  className="emoji-picker-container w-fit h-fit">
          <Picker onEmojiClick={ e => onSelect(e)} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default EmojiPopover;
