import { useParams } from "next/navigation"
import { Id } from "../../../../convex/_generated/dataModel"


export const useGetChannelId = () => {
    const Params = useParams()

    return Params.channelId as Id<'channels'>
}