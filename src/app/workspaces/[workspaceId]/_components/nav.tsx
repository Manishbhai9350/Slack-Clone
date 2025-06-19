import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";

const WorkspaceNav = () => {
  return (
    <nav className=" flex justify-center items-center  w-full h-[60px] text-slate-500 bg-slate-700">
      <div className="seachbar  flex items-center h-[40px] w-[80vw] md:max-w-[500px]">
        <div className="flex w-full h-full items-center gap-2">
          <Input className="text-white h-full placeholder:text-white" type="text" placeholder="Search Workspace" />
          <Button className="bg-slate-700 text-white h-full m-0 p-0 hover:text-slate-500 rounded-xs" type="submit" variant="outline">
            <Search />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default WorkspaceNav;
