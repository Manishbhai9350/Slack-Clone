import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";


interface UseCurrentMemberProps {
    workspaceId:Id<'workspaces'>
}


const UseCurrentMember = ({workspaceId}:UseCurrentMemberProps) => {

    const Member = useQuery(api.member.current,{workspaceId})

    if(typeof Member == 'undefined') return {Data:null,IsLoading:true}
    else if(!Member) return {Data:null,IsLoading:false}

    return {Data:Member,IsLoading:false}
}


export default UseCurrentMember;