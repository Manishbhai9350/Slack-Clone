import { cn } from "@/lib/utils";
import { type ElementType } from "react";

interface SidebarButtonProps {
  icon: ElementType;
  text: string;
  isActive?: boolean;
}

const SidebarButton = ({ 
  icon: Icon, 
  text = '', 
  isActive = false 
}: SidebarButtonProps) => {
  return (
    <div className="cursor-pointer">
      <div
        className={cn(
          "rounded-sm flex justify-center items-center h-10 aspect-square hover:text-white",
          isActive ? 'text-white bg-white/60' : 'text-white/90 bg-white/10'
        )}
      >
        <Icon />
      </div>
      <p className={cn(
        'text-sm text-center',
        isActive ? 'text-white' : 'text-white/60'
      )}>
        {text}
      </p>
    </div>
  );
};

export default SidebarButton;
