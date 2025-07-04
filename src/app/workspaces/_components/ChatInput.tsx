import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import { useCreateMessage } from "@/features/messages/api/useCreateMessage";
import { useGenerateUploadUrl } from "@/features/upload/api/useGenerateUploadUrl";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import dynamic from "next/dynamic";
import Quill, { Delta } from "quill";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../convex/_generated/dataModel";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

interface ChatInputProps {
  updatePending:boolean;
  isEdit:null | Id<'messages'>;
  editValue: string;
  onUpdate:(value:string) => void;
  onUpdateCancel:() => void;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
  IsCreating:boolean;
}


const ChatInput = ({isEdit,editValue,onUpdate,onUpdateCancel,updatePending,IsCreating,setIsCreating}:ChatInputProps) => {
  const workspaceId = useGetWorkspaceId();
  const channelId = useGetChannelId();

  const [ForceRenderCount, setForceRenderCount] = useState(0);
  const [Disabled, setDisabled] = useState(false);

  const InnerRef = useRef<Quill | null>(null);

  const { mutate: CreateMessage, IsPending } = useCreateMessage();
  const { mutate: GenerateUploadUrl, IsPending: IsGeneratingUploadUrl } =
    useGenerateUploadUrl();

  async function HandleSubmit(value: Delta, ImageInput: HTMLInputElement) {
    if (IsCreating || !InnerRef.current || (!value && !image)) return;

    if(isEdit) {
      onUpdate(JSON.stringify(value))
      return;
    }

    const image = ImageInput?.files[0];

    setDisabled(true);
    setIsCreating(true)

    const StringValue = JSON.stringify(value);

    const Values = {
      message: StringValue,
      workspace: workspaceId,
      channel: channelId,
      image: undefined,
    };

    if (image) {
      const url = await GenerateUploadUrl(null)!;
      if (url) {
        try {
          const result = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": image.type,
            },
            body: image,
          });

          const { storageId } = await result.json();
          Values.image = storageId;
        } catch (error) {
          
        }
      }
    }

    CreateMessage(Values, {
      onSuccess(messageId) {
        console.log(messageId);
        toast.success("Message Send Successfully");
      },
      onError() {
        toast.success("Failed To Send Message");
      },
      onSetteled() {
        setDisabled(false);
        ImageInput.value = null;
        setForceRenderCount((prev) => prev + 1);
        setIsCreating(false)
      },
    });
  }

  return (
    <div className="w-full p-2">
      <Editor
        variant={isEdit ? 'update' : 'create'}
        updateValue={editValue}
        isEdit={isEdit}
        key={ForceRenderCount}
        innerRef={InnerRef}
        disabled={Disabled || updatePending || IsPending || IsGeneratingUploadUrl}
        placeholder="Type Something...."
        onCancel={onUpdateCancel}
        onSubmit={HandleSubmit}
      />
    </div>
  );
};

export default ChatInput;
