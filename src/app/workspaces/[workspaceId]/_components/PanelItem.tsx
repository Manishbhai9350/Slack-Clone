import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'



interface PanelItemProps {
  isActive?:boolean;
  icon:LucideIcon;
  label:string;
}

const PanelItem = ({isActive = false,icon:Icon,label}:PanelItemProps) => {
  return (
      <Link href='' className={cn(
        'flex justify-between items-center w-full transition-all duration-300 rounded-sm px-2 py-1',
        isActive ? 'hover:bg-white/70 hover:text-slate-800 bg-white/70 text-slate-800' : 'hover:bg-white/70 hover:text-slate-800 text-white'
      )}>
        <div className="flex items-center justify-between gap-2">
          <Icon className='size-5' />
          <p className='text-xl'>{label}</p>
        </div>
      </Link>
  )
}

export default PanelItem