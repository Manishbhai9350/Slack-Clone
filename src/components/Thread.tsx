import { Loader, XIcon } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import Message from "./Message";
import UseCurrentMember from "@/features/workspace/api/useCurrentMember";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { useGetThread } from "@/features/thread/api/useGetThread";
import { useMemo, useRef, useState } from "react";
import Quill, { Delta } from "quill";
import { useCreateMessage } from "@/features/messages/api/useCreateMessage";
import { useGetChannelId } from "@/features/channels/hooks/useChannelId";
import { useParentId } from "@/features/thread/store/useParentId";
import { toast } from "sonner";
import { useUpdateMessage } from "@/features/messages/api/useUpdateMessage";
import dynamic from "next/dynamic";
import { differenceInSeconds } from "date-fns";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import { groupMessagesByDate } from "@/lib/message.lib";

const Editor = dynamic(() => import("./Editor"), { ssr: false });

const TIME_THRESHOLD = 30;

interface ThreadProps {
  message: Id<"messages">;
  onCancel: () => void;
}

const Thread = ({ message, onCancel }: ThreadProps) => {
  const workspaceId = useGetWorkspaceId();
  const ChannelId = useGetChannelId();

  const [parentId, setParentId] = useParentId();

  const { Data: CurrentMember } = UseCurrentMember({ workspaceId });
  const { Data: CurrentMessage } = useGetThread({
    id: message,
    parent: parentId,
  });

  const {
    messages: Threads,
    loadMore,
    status,
    isLoading: IsMessagesLoading,
  } = useGetMessages({ channel: ChannelId, parent: parentId });

  const CanLoadMore = useMemo(() => status == "CanLoadMore", [status]);
  const IsLoadingMore = useMemo(() => status == "LoadingMore", [status]);

  const GroupedThreads = groupMessagesByDate(Threads);
  console.log(Threads);
  console.log(GroupedThreads);

  const { mutate: CreateThread, IsPending: IsCreatingThread } =
    useCreateMessage();

  const { mutate: UpdateThread, IsPending: IsUpdatingThread } =
    useUpdateMessage();

  const [ForceRenderCount, setForceRenderCount] = useState(0);
  const [EditValue, setEditValue] = useState<string>("");
  const [IsEdit, setIsEdit] = useState<Id<"messages"> | null>(null);
  const [IsCreating, setIsCreating] = useState(false);

  const InnerRef = useRef<Quill | null>(null);

  function onUpdateCancel() {}

  function HandleSubmit(Value: Delta, ImageInp: HTMLInputElement) {
    if (!InnerRef.current) return;

    const Message = JSON.stringify(Value);

    // Editing Reply
    if (IsEdit) {
      UpdateThread(
        {
          message: IsEdit,
          value: Message,
        },
        {
          onSuccess() {
            toast.success("Thread Updated Successfully");
            setIsEdit(null);
            ImageInp.value = null;
            setForceRenderCount((prev) => prev + 1);
          },
          onError() {
            toast.success("Failed To Update Thread");
          },
          throwError: true,
        }
      );
      return;
    }

    // Creating A New Reply
    CreateThread(
      {
        workspace: workspaceId,
        message: Message,
        channel: ChannelId,
        parent: parentId,
      },
      {
        onSuccess() {
          toast.success("Reply Added");
          ImageInp.value = null;
          setForceRenderCount((prev) => prev + 1);
        },
        onError() {
          toast.success("Failed To Add Reply");
        },
        throwError: true,
      }
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="message shrink-0 flex justify-between items-center h-12 px-2 py-2 border-b">
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
          image={CurrentMessage.image || ""}
          creationTime={CurrentMessage._creationTime}
          isCompact={false}
          authorName={CurrentMessage?.user?.name || ""}
          authorImage={CurrentMessage?.user?.image || ""}
          key={CurrentMessage._creationTime}
          content={CurrentMessage.message}
          updated={CurrentMessage?.updated || null}
          reactions={CurrentMessage.reactions || []}
          isThread={true}

        />
      )}
      <div className="flex-1 w-full overflow-y-scroll py-2">
        <div className="px-4 py-2 space-y-2 min-h-full flex flex-col-reverse">
          {GroupedThreads &&
            Object.entries(GroupedThreads).map(([label, group]) => {
              return (
                <div key={label}>
                  <div className="w-full border-b border-gray-400 relative my-6">
                    <div className="absolute p-2 rounded-4xl px-4 top-1/2 left-1/2 -translate-1/2 text-xs bg-white border border-gray-400 text-black/60 uppercase mb-2">
                      {label}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {group.reverse().map((msg, i) => {
                      const PrevMessage = group[i - 1];
                      const isCompact =
                        PrevMessage &&
                        PrevMessage?.member?.id == msg?.member?.id &&
                        differenceInSeconds(
                          new Date(msg._creationTime),
                          new Date(PrevMessage._creationTime)
                        ) < TIME_THRESHOLD;
                      return (
                        <Message
                          id={msg!._id}
                          IsCreating={IsCreating}
                          setIsCreating={setIsCreating}
                          setEditValue={setEditValue}
                          isEdit={IsEdit}
                          setEdit={setIsEdit}
                          isAuthor={msg?.member?._id == CurrentMember?._id}
                          image={msg.image}
                          creationTime={msg._creationTime}
                          isCompact={isCompact}
                          authorName={msg?.user?.name}
                          authorImage={msg?.user?.image || ""}
                          key={msg._creationTime}
                          content={msg.message}
                          updated={msg.updated}
                          reactions={msg.reactions || []}
                          isThread={true}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {IsLoadingMore && (
            <div className="w-full border-b border-gray-400 relative my-6">
              <div className="absolute p-2 rounded-4xl px-4 top-1/2 left-1/2 -translate-1/2 text-xs bg-white border border-gray-400 text-black/60 uppercase mb-2">
                <Loader className="size-4 animate-spin" />
              </div>
            </div>
          )}
          <div
            ref={(el) => {
              if (el) {
                const observer = new IntersectionObserver(
                  (entries) => {
                    if (
                      entries &&
                      entries.length > 0 &&
                      entries[0].isIntersecting &&
                      CanLoadMore
                    ) {
                      loadMore();
                    }
                  },
                  {
                    threshold: 1.0,
                  }
                );

                observer.observe(el);

                return () => observer.disconnect();
              }
            }}
            className="load-more-observer"
          />
        </div>
      </div>
      <div className="w-full pb-2 px-2 h-fit flex justify-center">
        <Editor
          variant={IsEdit ? "update" : "create"}
          updateValue={EditValue}
          isEdit={IsEdit}
          key={ForceRenderCount}
          innerRef={InnerRef}
          disabled={IsCreatingThread || IsUpdatingThread}
          placeholder="Add A Reply..."
          onCancel={onUpdateCancel}
          onSubmit={HandleSubmit}
          noControl
        />
      </div>
    </div>
  );
};

export default Thread;
