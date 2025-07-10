import { useQueryState } from "nuqs";



export const useParentId = () => {
    return useQueryState('parentId')
}