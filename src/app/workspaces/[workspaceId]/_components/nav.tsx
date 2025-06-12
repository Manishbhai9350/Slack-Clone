import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React from 'react'

const WorkspaceNav = () => {
  return (
    <nav className=' flex justify-center items-center  w-full h-[60px] text-white bg-slate-700'>
        <div className="seachbar flex items-center h-[40px] w-[80vw] md:max-w-[500px]">
          <Input placeholder='Search Workspace' className='bg-white/40 border-0 border-none rounded-none text-white placeholder:text-white w-[calc(100% - 40px)] h-full border-r-0 outline-none focus-visible:border-ring/0' />
          <Button className='w-10 h-full rounded-none'>
            <Search />
          </Button>
        </div>
    </nav>
  )
}

export default WorkspaceNav