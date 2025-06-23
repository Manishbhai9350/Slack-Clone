
import {useAtom} from 'jotai';
import { ChannelAtom } from '../store';


export const useChannelAtom = () => {
    return useAtom(ChannelAtom)
}
