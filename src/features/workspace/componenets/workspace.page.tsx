'use client'
import { useGetWorkSpace } from '../api/useGetWorkspace'
import { Id } from '../../../../convex/_generated/dataModel'


interface WorkSpaceProps {
    workspaceId:Id<'workspaces'>
}

const WorkSpacePage = ({workspaceId}:WorkSpaceProps) => {
  const {Data,IsLoading} = useGetWorkSpace({workspaceId})

  if(IsLoading) {
    return <p>Loading....</p>
  }

  if(!Data && !IsLoading) {
    return <p>Unable To Find Workspace</p>
  }

  console.log(Data)
  
  const date = new Date(Data?._creationTime)

  return (
    <div>
      <h1>Name: {Data?.name}</h1>
      <h2>JoinCode: {Data?.joinCode}</h2>
      <h2>Creation Time: {date.getSeconds()%60 }/{date.getMinutes()%60}/{date.getHours()%12}</h2>
      <h2>Creation Date: {date.getDate()}/{date.getMonth()}/{date.getFullYear()}</h2>
    </div>
  )
}

export default WorkSpacePage