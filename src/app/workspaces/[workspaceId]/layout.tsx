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
        <div style={{height:innerHeight-60}} className="workspace-layout w-full  bg-red-400 flex">
            <WorkspaceSidebar />
            {children}
        </div>
    </>
  )
}

export default WorkspaceLayout