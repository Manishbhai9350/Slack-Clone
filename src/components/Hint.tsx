import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";


interface HintProps {
    label:string;
    children:ReactNode;
}


const Hint = ({children,label}:HintProps) => {
  return (
    <Tooltip>
        <TooltipTrigger asChild>
            {children}
        </TooltipTrigger>
        <TooltipContent>
            <p>{label}</p>
        </TooltipContent>
    </Tooltip>
  )
}

export default Hint