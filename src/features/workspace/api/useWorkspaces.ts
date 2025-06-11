import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useWorkspaces = () => {
    const Data = useQuery(api.workspaces.get);
    

    if(Data == undefined) return {Data:null,IsLoading:true}

    return {Data,IsLoading:false}
}