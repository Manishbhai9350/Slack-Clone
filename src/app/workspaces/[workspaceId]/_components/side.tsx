import React from 'react'
import SidebarButton from './SidebarButton'
import { Bell, Home, MessageSquare, MoreHorizontal } from 'lucide-react'
import SidebarDropDown from './SidebarWorkspaces'

const WorkspaceSidebar = () => {
  return (
    <aside className='w-[60px] h-full gap-y-4 flex flex-col justify-start items-center py-6 bg-slate-700 text-white'>
        <SidebarDropDown />
        <SidebarButton text='Home' icon={Home} isActive />
        <SidebarButton text='DMs' icon={MessageSquare} />
        <SidebarButton text='Activity' icon={Bell} />
        <SidebarButton text='More' icon={MoreHorizontal} />
    </aside>
  )
}

export default WorkspaceSidebar