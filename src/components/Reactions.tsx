import { cn } from "@/lib/utils";
import { Doc,Id } from "../../convex/_generated/dataModel"
import UseCurrentMember from "@/features/workspace/api/useCurrentMember";
import { useGetWorkspaceId } from "@/features/workspace/hooks/useGetWorkspaceId";
import { Button } from "./ui/button";


interface ReactionsProps {
    reactions:Array<
        Omit<Doc<'reactions'> , 'member'> & {
            count:number;
            memberIds: Id<'members'>[]
        }
    >;
    onChange: (value:string) => void;
}

const Reactions = ({reactions,onChange}:ReactionsProps) => {
    const workspaceId = useGetWorkspaceId()
    const {Data:CurrentMember} = UseCurrentMember({workspaceId})

    if(!reactions || reactions.length == 0) return null;


    return <div className="flex flex-wrap justify-start items-start gap-2">
        {
            reactions && reactions.map((Reaction) => (
                <Button onClick={() => onChange(Reaction.value)} key={Reaction._id} className={
                    cn('flex  hover:bg-slate-100 hover:border-blue-500  bg-slate-100 transition-all duration-200 px-2 py-[4px] cursor-pointer rounded-full border justify-evenly items-start h-fit w-fit gap-2',
                        Reaction.memberIds.includes(CurrentMember?._id) && "border-blue-500"
                    )
                }>
                   <p className="-mt-1 group/reaction">
                     {
                        Reaction.value
                    }
                    <span className={
                        cn(
                            "text-muted-foreground group-hover/reaction:text-blue-500",
                            Reaction.memberIds.includes(CurrentMember?._id) && "text-blue-500"
                        )
                    } >
                        {Reaction.count}
                    </span>
                   </p>
                </Button>
            ))
        }
    </div>
}

export default Reactions