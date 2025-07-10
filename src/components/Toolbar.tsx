import { MessageSquareMore, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "./ui/button";
import Hint from "./Hint";
import EmojiPopover from "./EmojiPopover";
import { Id } from "../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import UseCurrentMember from "@/features/workspace/api/useCurrentMember";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { useDeleteMessage } from "@/features/messages/api/useDeleteMessage";
import { toast } from "sonner";
import UseConfirm from "./hooks/useConfirm";
import { useParentId } from "@/features/thread/store/useParentId";

interface ToolbarProps {
  message: Id<"messages">;
  isEdit: null | Id<"messages">;
  onEdit: () => void;
  onReact: (Emoji: string) => void;
  isAuthor: boolean;
  isCompact?: boolean;
  isThread: boolean;
}

const Toolbar = ({
  isAuthor,
  onEdit,
  isEdit,
  isCompact = false,
  message,
  onReact,
  isThread,
}: ToolbarProps) => {
  const { mutate: DeleteMessage, IsPending: IsDeletingMessage } =
    useDeleteMessage();
  const [Ok, Confirm] = UseConfirm();

  const [parentId, setParentId] = useParentId();

  async function HandleDelete() {
    if (!message) return;

    const IsOk = await Ok();

    if (!IsOk) return;

    DeleteMessage(
      { message },
      {
        onSuccess() {
          toast.success("Message Deleted");
        },
        onError() {
          toast.error("Failed To Delete Message");
        },
        throwError: true,
      }
    );
  }

  function OnReply() {
    setParentId(message);
  }

  return (
    <div
      className={cn(
        "absolute top-1 right-5 opacity-0 group-hover:opacity-100",
        isCompact && "top-[2px]"
      )}
    >
      <Confirm
        message="Are you sure to delete this message?"
        title="Delete this message!"
      />
      <div className="flex gap-2">
        <EmojiPopover
          label="Reactions"
          onEmojiSelect={(e: { native: string }) => onReact(e.native)}
        >
          <Button disabled={IsDeletingMessage} variant="outline">
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!isThread && (
          <Hint label="Reply">
            <Button
              onClick={OnReply}
              disabled={IsDeletingMessage}
              variant="outline"
            >
              <MessageSquareMore className="size-4" />
            </Button>
          </Hint>
        )}
        {isAuthor &&
          !isEdit && (
            <>
              <Hint label="Edit">
                <Button
                  disabled={IsDeletingMessage}
                  onClick={onEdit}
                  variant="outline"
                >
                  <Pencil className="size-4" />
                </Button>
              </Hint>
              <Hint label="Delete">
                <Button
                  disabled={IsDeletingMessage}
                  onClick={HandleDelete}
                  variant="outline"
                >
                  <Trash className="size-4" />
                </Button>
              </Hint>
            </>
          )}
      </div>
    </div>
  );
};

export default Toolbar;
