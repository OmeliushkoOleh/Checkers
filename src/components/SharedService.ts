import { ICellComponent } from "./Cell/Cell";
import { CheckerProps, Player } from "./Checker/Checker";

interface Iobj  {
    coordinates:{
        x:number|null,
        y:number|null,
    },
    cellsArr:ICellComponent[],
    setArr:React.Dispatch<React.SetStateAction<never[]>>,
    setTurnToMove:React.Dispatch<React.SetStateAction<Player>>,
    turnToMove:Player,
    checkerWhoHit:CheckerProps|null,
}
// class sharedService{
//     cellsArray1 = []
//     coordinates = {
//         x:null,
//         y:null,
//     }
// }

export const sharedService:Iobj = {
    coordinates:{
        x:0,
        y:0,
    },
    cellsArr:[],
    setArr:(arr)=>{},
    setTurnToMove:()=>{},
    turnToMove:1,
    checkerWhoHit:null
}
