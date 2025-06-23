

const JoinPatch = 'abcdefghijklmnopqrstuvwxyz123456789'

const GenRL = (R:number,L:number,Min=0,Max=L) => {
    const RL = Math.floor(Math.max(Min,Math.min(R * L,Max)));
    return RL
}


export const GenerateJoinCode = () => {
    const R = Math.random() 
    const RL = GenRL(R,JoinPatch.length,3,10)
    const RawCode = new Array(RL).fill('_').map(e => JoinPatch[GenRL(Math.random(),JoinPatch.length,0)]).join('')
    return RawCode
}