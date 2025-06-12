import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"
import { useMemo } from "react"



interface GetWorkspaceProps {
    workspaceId:Id<'workspaces'>
}


export const useGetWorkSpace = ({workspaceId}:GetWorkspaceProps) => {
    const Data = useQuery(api.workspaces.getWorkspace,{workspaceId})

    const IsLoading = useMemo(() => Data == undefined,[Data])

    if(Data == null) return {Data:null,IsLoading}
    else if(Data == undefined) return {Data:null,IsLoading}

    return {Data,IsLoading}
}