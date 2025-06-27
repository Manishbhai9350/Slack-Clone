import dynamic from "next/dynamic"

const Editor = dynamic(() => import('@/components/Editor'),{ssr:false})

const ChatInput = () => {
  return (
    <div className='w-full p-2'>
        <Editor disabled={false} placeholder="Type Something...." onCancel={() => {}} onSubmit={() => {}} />
    </div>
  )
}

export default ChatInput