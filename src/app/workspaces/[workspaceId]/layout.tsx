"use client";

import React from "react";
import WorkspaceNav from "./_components/nav";
import WorkspaceSidebar from "./_components/sidebar/side";
import WorkspacePanel from "./_components/panel/WorkspaceResiable";
import { useParentId } from "@/features/thread/store/useParentId";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface workspaceLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: workspaceLayoutProps) => {

  return (
    <>
      <WorkspaceNav />
      <div className="workspace-layout w-full h-[calc(100vh-60px)] flex">
        <WorkspaceSidebar />
        <WorkspacePanel>{children}</WorkspacePanel>
      </div>
    </>
  );
};

export default WorkspaceLayout;
