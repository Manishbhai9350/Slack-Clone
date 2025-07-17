import { useParams } from "next/navigation"
import { Id } from "../../../../convex/_generated/dataModel"


export const useGetOtherMemberId = () => {
    const Params = useParams()

    return Params?.memberId as Id<'members'>
}