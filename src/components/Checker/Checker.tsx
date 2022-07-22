import * as React from "react";
import Cell, { arrOfFildsWherCanHit, canMove,  cellColor, wherCanDrop, whoCanHit } from "../Cell/Cell";
import {size}  from '../Cell/Cell'
import {  sharedService } from "../SharedService";
// import { cellsArray2 } from "../Fild/Fild";
export type CheckerProps = {
  // turnToMove чья шашка
  player:Player,
  x:number,
  y:number,
  arr:any[],
  setArr:React.Dispatch<React.SetStateAction<JSX.Element[]>>,
  isKing:boolean,
};


export type Player = 1 | 2;

const Checker: React.FC<CheckerProps> = (props:CheckerProps) => {  
let class1 

if(props.player === 1){
   class1 = props.isKing?"checker1 king":"checker1"
} else(
  class1 = props.isKing?"checker2 king":"checker2"

)
const dragstart = (e:any)=>{
  
  let newArr:any =  [...sharedService.cellsArr]
  if(sharedService.turnToMove  !==  props.player){
    return false
  }

  let arrOfch = arrOfFildsWherCanHit()
  let someCanHit = arrOfch.some(e=>{
    return e.length !== 0
  })
  if(someCanHit){
    let currentCanMove = whoCanHit(props.x,props.y)
    if(currentCanMove === null){
      return false
    }
  }
  let checker = JSON.stringify(props)
  e.dataTransfer!.setData("text/plain",checker);
  sharedService.coordinates.x = props.x
  sharedService.coordinates.y = props.y
  let canMovedCoords = wherCanDrop(props.x,props.y)

  if(canMovedCoords.length == 0 ){
    canMovedCoords = canMove(props.x,props.y)
  }

  newArr.forEach((Element:any,index:any) => {
    let xEven = Element.props.x % 2 == 0
    let yEven = Element.props.y % 2 == 0
    const condition = (xEven && yEven) || (!xEven && !yEven)
    const x = Element.props.x
    const y = Element.props.y
    const color = Element.props.color
    const checker = Element.props.checker
    let canDrop = canMovedCoords.find(e=>{
      return e.x === x && e.y ===y
    })
    
    if(canDrop ){
      newArr[index] = <Cell setArr={sharedService.setArr}  canDrop={!!canDrop} x={x} y={y} color={color} key={Math.random()*1000} checker={checker} ></Cell>

    } 
  });
  sharedService.cellsArr = newArr
  props.setArr(newArr)
}


function handleDragEnd() {
  let newArr:any =  [...sharedService.cellsArr];
  newArr.forEach((e:any,index:any)=>{
    let copiedProps = {...e.props}
    copiedProps.canDrop = false
    copiedProps.key = Math.random()*1000 
    newArr[index] = <Cell {...copiedProps} ></Cell>
  })
  props.setArr(newArr)
  sharedService.cellsArr = newArr
}

function del(e:any){
  e.preventDefault();
  let newArr:any =  [...sharedService.cellsArr];  
  
  newArr.forEach((e:any,index:any)=>{
    let deletedChecker = !(e.props.x == props.x && e.props.y == props.y)
    if(!deletedChecker){
      let copiedProps = {...e.props,checker:null}
      copiedProps.key = Math.random()*1000 
      newArr[index] = <Cell {...copiedProps} ></Cell>
    }
  })
  props.setArr(newArr)
  sharedService.cellsArr = newArr

}

  return <div draggable="true" onDragStart={dragstart} onContextMenu={del} onDragEnd={handleDragEnd} className={class1} style={{width:size,height:size,backgroundColor:"transrapent"}}></div>;
};

export default Checker;

