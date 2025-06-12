import { useParams } from "next/navigation"
import { Id } from "../../../../convex/_generated/dataModel"


export const useGetWorkspaceId = () => {
    const Params = useParams()

    return Params.workspaceId as Id<'workspaces'>
}