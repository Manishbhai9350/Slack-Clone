import Hint from "@/components/Hint";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

interface PanelItemsSectionProps {
  seperator?: boolean;
  children: ReactNode;
  label?: string;
  endHint?: string;
  role?: string;
  toggle?: boolean;
  opened?: boolean;
  end?: LucideIcon;
  onEnd?: () => void;
}

const PanelItemSection = ({
  children,
  seperator,
  label,
  toggle,
  opened=false,
  end: Icon,
  onEnd,
  endHint='',
  role = 'member'
}: PanelItemsSectionProps) => {
  const [on, Toggle] = useToggle(opened);

  return (
    <div className="flex flex-col px-4 mb-4">
      {seperator && <Separator className="opacity-50" />}
      <div className="head flex justify-between items-center pt-2">
        {label && toggle ? (
          <div
            onClick={Toggle}
            className="w-fit gap-2 rounded-xs cursor-pointer transition-all duration-300 flex px-2 py-1 items-center justify-start hover:bg-white/70 hover:text-slate-800 text-white"
          >
            <FaCaretDown
              className={cn(
                "transition-all duration-300 size-6",
                !on ? "-rotate-90" : "rotate-0"
              )}
            />
            <h1 className="text-xl font-semibold capatilize truncate">
              {label}
            </h1>
          </div>
        ) : (
          label && <p>{label}</p>
        )}
        {Icon && role == 'admin' && (
          <Hint label={endHint}>
            <div
              onClick={onEnd}
              className="end hover:bg-white/70 hover:text-slate-800 text-white cursor-pointer p-1 transition duration-300 rounded-xs"
            >
              <Icon className='size-6' />
            </div>
          </Hint>
        )}
      </div>
      <div className="pl-2">{toggle && on && children}</div>
      {!toggle && children}
    </div>
  );
};

export default PanelItemSection;
