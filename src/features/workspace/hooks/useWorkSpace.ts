import {WorkSpaceAtom} from '../store';
import {useAtom} from 'jotai';


export const useWorkspaceAtom = () => {
    return useAtom(WorkSpaceAtom)
}
