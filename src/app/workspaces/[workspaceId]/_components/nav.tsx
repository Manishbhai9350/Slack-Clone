import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";


const WorkspaceNav = () => {
  return (
    <nav className=" flex justify-center items-center  w-full h-[60px] text-slate-500 bg-slate-700">
      <div className="seachbar  flex items-center h-[40px] w-[80vw] md:max-w-[500px]">
        <div className="flex w-full h-full items-center gap-2">
          <Button className="w-full gap-2 flex items-center justify-center bg-white/70 text-slate-800 hover:bg-white/70 hover:text-slate-800">
            <Search className="size-5" /> 
            <p className="text-xl font-regular">Search</p>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default WorkspaceNav;
