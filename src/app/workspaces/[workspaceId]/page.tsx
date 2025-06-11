import WorkSpacePage from "@/features/workspace/componenets/workspace.page"
import { Id } from "../../../../convex/_generated/dataModel";


interface WorkspaceProps {
  params:{
    workspaceId:Id<'workspaces'>
  }
}


const Workspace = async ({params}:WorkspaceProps) => {
  const {workspaceId} = await params;
  if(!workspaceId) return null;
  return (
    <>
      <WorkSpacePage workspaceId={workspaceId} />
    </>
  )
}

export default Workspace