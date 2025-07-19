import React from 'react'
import SidebarButton from './SidebarButton'
import { Bell, Home, MessageSquare, MoreHorizontal } from 'lucide-react'
import UserAvatar from '@/features/auth/components/UserAvatar'
import SidebarDropDown from './SidebarDropdown'

const WorkspaceSidebar = () => {
  return (
    <aside className='w-[80px] h-full overflow-y-scroll gap-y-4 flex flex-col justify-start items-center pt-2 bg-slate-700 text-white'>
        <SidebarDropDown />
        <SidebarButton text='Home' icon={Home} isActive />
        <SidebarButton text='DMs' icon={MessageSquare} />
        <SidebarButton text='Activity' icon={Bell} />
        <SidebarButton text='More' icon={MoreHorizontal} />
        <div className='sidebar-user-avatar w-full mb-2 grow flex flex-1  items-end justify-center' >
          <UserAvatar />
        </div>
    </aside>
  )
}

export default WorkspaceSidebar