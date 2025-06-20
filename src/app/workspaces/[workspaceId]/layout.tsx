'use client';

import React from "react"
import WorkspaceNav from "./_components/nav";
import WorkspaceSidebar from "./_components/side";


interface workspaceLayoutProps {
    children:React.ReactNode;
}

const WorkspaceLayout = ({children}:workspaceLayoutProps) => {
  return (
    <>
        <WorkspaceNav />
        <div className="workspace-layout w-full h-[calc(100vh-60px)] flex">
            <WorkspaceSidebar />
            {children}
        </div>
    </>
  )
}

export default WorkspaceLayout