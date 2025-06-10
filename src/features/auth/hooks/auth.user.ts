import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api";



export const useUser = () => {
    const User = useQuery(api.users.current)

    if(User == undefined) return {user:null,isLoading:true};

    return {user:User,isLoading:false}
}