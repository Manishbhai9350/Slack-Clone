'use client'
import WorkspacePanel from '@/app/workspaces/[workspaceId]/_components/WorkspaceResiable';
import { useGetWorkSpace } from '../api/useGetWorkspace'
import { useGetWorkspaceId } from '../hooks/useGetWorkspaceId'


const WorkSpacePage = () => {
  const workspaceId = useGetWorkspaceId();
  const {Data,IsLoading} = useGetWorkSpace({workspaceId})


  if(IsLoading) {
    return <p>Loading....</p>
  }

  if(!Data && !IsLoading) {
    return <p>Unable To Find Workspace</p>
  }

  
  const date = new Date(Data?._creationTime)

  return (
    <>
      {JSON.stringify(Data)}
    </>
  )
}

export default WorkSpacePage