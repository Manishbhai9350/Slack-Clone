import { XIcon } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import Message from "./Message";
import UseCurrentMember from "@/features/workspace/api/useCurrentMember";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { useGetThread } from "@/features/thread/api/useGetThread";
import { useState } from "react";

interface ThreadProps {
  message: Id<"messages">;
  onCancel: () => void;
}

const Thread = ({ message, onCancel }: ThreadProps) => {
  const workspaceId = useGetWorkspaceId();
  const { Data: CurrentMember } = UseCurrentMember({ workspaceId });
  const { Data: CurrentMessage } = useGetThread({ id: message });


  const [EditValue, setEditValue] = useState<string>('')
  const [IsEdit, setIsEdit] = useState<Id<'messages'> | null>(null)
  const [IsCreating, setIsCreating] = useState(false)


  return (
    <>
      <div className="message flex justify-between items-center h-12 px-2 py-2 border-b">
        <h1># Threads</h1>
        <Button onClick={onCancel} variant="ghost">
          <XIcon />
        </Button>
      </div>
      {CurrentMessage && (
        <Message
            id={CurrentMessage!._id}
            IsCreating={IsCreating}
            setIsCreating={setIsCreating}
            setEditValue={setEditValue}
            isEdit={IsEdit}
            setEdit={setIsEdit}
            isAuthor={CurrentMessage?.member?._id == CurrentMember?._id}
            image={CurrentMessage.image || ''}
            creationTime={CurrentMessage._creationTime}
            isCompact={false}
            authorName={CurrentMessage?.user?.name || ''}
            authorImage={CurrentMessage?.user?.image || ''}
            key={CurrentMessage._creationTime}
            content={CurrentMessage.message}
            updated={CurrentMessage?.updated || null}
            reactions={CurrentMessage.reactions || []}
            isThread={true}
        />
      )}
    </>
  );
};

export default Thread;
