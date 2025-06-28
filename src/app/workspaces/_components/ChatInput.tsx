import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import { useCreateMessage } from "@/features/messages/api/useCreateMessage";
import { useGenerateUploadUrl } from "@/features/upload/api/useGenerateUploadUrl";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import dynamic from "next/dynamic";
import Quill, { Delta } from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const ChatInput = () => {
  const workspaceId = useGetWorkspaceId();
  const channelId = useGetChannelId();

  const [ForceRenderCount, setForceRenderCount] = useState(0)

  const InnerRef = useRef<Quill | null>(null);

  const { mutate: CreateMessage, IsPending } = useCreateMessage();
  const { mutate: GenerateUploadUrl, IsPending: IsGeneratingUploadUrl } =
    useGenerateUploadUrl();

  async function HandleSubmit(value: Delta, ImageInput:HTMLInputElement) {

    const image = ImageInput.files[0]

    if (!InnerRef.current || (!value && !image)) return;

    const StringValue = JSON.stringify(value);

    console.log(value,image)

    const Values = {
      message: StringValue,
      workspace: workspaceId,
      channel: channelId,
      image: undefined,
    };

    if (image) {
      const url = await GenerateUploadUrl(null)!;
      if (url) {
        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        });

        const { storageId } = await result.json();
        Values.image = storageId;
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
        ImageInput.value = null
        setForceRenderCount(prev => prev + 1)
      },
    });
  }

  return (
    <div className="w-full p-2">
      <Editor
        key={ForceRenderCount}
        innerRef={InnerRef}
        disabled={IsPending || IsGeneratingUploadUrl}
        placeholder="Type Something...."
        onCancel={() => {}}
        onSubmit={HandleSubmit}
      />
    </div>
  );
};

export default ChatInput;
