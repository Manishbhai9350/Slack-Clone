'use client';
import React, { useEffect, useState } from 'react'
import SignUpForm from './SignUp.form'
import LoginForm from './LogIn.form'
import {AuthType} from './Types'
import { useWorkspaceAtom } from '@/features/workspace/hooks/useWorkSpace';

const AuthScreen = () => {
    const [Form, setForm] = useState<AuthType>('signin')
    const [open,setOpen] = useWorkspaceAtom()
    useEffect(() => {
      setOpen(false)
      return () => {
        
      }
    }, [])
    
  return (
    <main className='w-full h-screen bg-zinc-800 text-black flex justify-center items-center'>
        <div className="form-container mx-4 relative w-full h-auto md:w-[400px]">
            {
                Form == 'signin' ? (<LoginForm setForm={setForm} />) : (<SignUpForm setForm={setForm} />)
            }
        </div>
    </main>
  )
}

export default AuthScreen