import * as React from "react";
import styles from './Cell.module.css';
import Checker, { CheckerProps, dragstart, Player } from '../Checker/Checker'
import { sharedService } from "../SharedService";
import $ from 'jquery';
import { recursion, Step } from "../BotService";
import { createBranch } from "../Fild/Fild";

let dataTrans:any
export let arrOfAllSteps:Step[]


export type cellColor = "white"|"black";
export type CellProps = {
  x:number,
  y:number,
  color:cellColor,
  checker: any,
  canDrop:boolean,
  setArr:React.Dispatch<React.SetStateAction<JSX.Element[]>>,
  setStep:React.Dispatch<React.SetStateAction<number>>,
};

export let arrOfSteps:IGemeDataInterface[] = JSON.parse(localStorage.getItem("gameData")!) || []

export interface IGemeDataInterface {
  coordinates:{x:number|null,y:number|null},
  checkers:Omit<CheckerProps,"setArr"|"arr">[],
  cells:Omit<CellProps,"setArr"|"checker">[],
  turnToMove:Player,
  checkerWhoHit:Omit<CheckerProps,"arr"|"setArr">|null,
}
export  const size = 100

function emulateDragStart(x:number,y:number){
  let dataTransfer = new DataTransfer()
  let event = new Event("dragstart");
  dataTrans = dataTransfer;
  (event as any).dataTransfer = dataTransfer
  dragstart(event,sharedService.enemy!)
}
function emulateDrop (){
  let coord = createBranch()
  console.log(createBranch());
  
  console.log(sharedService);
  console.log(coord!.x);
  
  debugger
  let neededCell = sharedService.cellsArr.find(e=>e.props.x == coord!.x && e.props.y == coord!.y )

  let event = new Event("drop");
  (event as any).dataTransfer  = dataTrans

  handleDrop(event,neededCell!.props)

}
function handleDrop(e:any,props:CellProps) { 
  const data:CheckerProps = JSON.parse(e.dataTransfer.getData("text"));
  e.stopPropagation(); // препятствует перенаправлению в браузере.
  let newArr:any =  [];  
  sharedService.checkerWhoHit = null

  let cb = (acc:number,curr:any)=>{
    if(curr.props.checker){
      return acc + 1
    }else{
      return acc
    }
  }
  let prevCoutnOfCheckersBefore = sharedService.cellsArr.reduce(cb,0)


  const removeFrom = ():CellProps[]=>{
    let arrToDel:CellProps[] = []
    let delX = props.x - data.x > 0 ? 1 : - 1
    let delY = props.y - data.y > 0 ? 1 : - 1
    let currentX = data.x - delX
    let currentY = data.y - delY
    while(props.x !== currentX + delX  && props.y !== currentY + delX ){
      
      currentX = currentX + delX
      currentY = currentY + delY
      let itemToDel = sharedService.cellsArr.find(e=>{
        return e.props.x === currentX && e.props.y === currentY
      })
      if(itemToDel){
        arrToDel.push(itemToDel.props)
      }
    }
    return arrToDel
  }
  let itemsToRemove = removeFrom()

  newArr = sharedService.cellsArr.map((e:ICellComponent)=>{
    if(itemsToRemove.includes(e.props)){ //удаление шашки которая походила, о все шашки которые побили
      let newProps = {...e.props,checker:null,key:Math.random()*1000}
      e=<Cell {...newProps} ></Cell>
    }
    if(e.props === props){ //создаёт шашку на месте куда походил или побил 
      let isKing:boolean = data.isKing
      if(data.player === 1 && props.y === 8){
        isKing = true
      }  else if (data.player === 2 && props.y === 1){
        isKing = true
      }
      let newProps = {
        ...e.props,
        checker:<Checker {...{...data,x:props.x,y:props.y,setArr:props.setArr,isKing:isKing}}></Checker>,
        key:Math.random()*1000,
        canDrop:false,
      }
      
              
      e=<Cell {...newProps} ></Cell>       
    }
    if(e.props.canDrop === true){ //создаёт шашку на месте куда походил или побил
      let newProps = {
        ...e.props,
        key:Math.random()*1000,
        canDrop:false,
      }
      e=<Cell {...newProps} ></Cell>
    }
    return e
  })
  let prevCoutnOfCheckersAfter = newArr.reduce(cb,0)
  
    
  if(prevCoutnOfCheckersBefore !== prevCoutnOfCheckersAfter){     
    let newProps = {...data,x:props.x,y:props.y}
    sharedService.checkerWhoHit = newProps
  }
      
  props.setArr(newArr)
  sharedService.cellsArr = newArr
  let checkerProps:CheckerProps = sharedService.checkerWhoHit!
  if(sharedService.checkerWhoHit == null || (sharedService.checkerWhoHit != null && !whoCanHit(checkerProps.x,checkerProps.y))){
    let inverted:Player
    if(sharedService.turnToMove === 1){
      inverted = 2
      sharedService.turnToMove = inverted
      sharedService.setTurnToMove(inverted)
    } else{
      inverted = 1
      sharedService.turnToMove = inverted
      sharedService.setTurnToMove(inverted)
    }
  }
  
  
  
  props.setStep((prev)=>prev + 1)
  if(sharedService.turnToMove === 1){
    sharedService.player!.x = props.x 
    sharedService.player!.y = props.y 

    
    let fromWherMove = getBestStep()
    
    emulateDragStart(fromWherMove.x,fromWherMove.y)
    setTimeout(()=>{emulateDrop()},300)
  } else{
    sharedService.enemy!.x = props.x 
    sharedService.enemy!.y = props.y
  }
}

export interface ICellComponent  {
  props:CellProps
}
 type Filds = (x:number,y:number)=>{x:number,y:number}[]

export const arrOfFildsWherCanMove = ()=>{
let arrOf:any[] = []
let filtered = sharedService.cellsArr.filter(e=>{
  return e.props?.checker?.props.player === sharedService.turnToMove
})
filtered.forEach(e=>{
  arrOf.push(canMove(e.props.x,e.props.y)) 
})
return arrOf
}

export const canMove:Filds = (x,y)=>{
  let currentCell = sharedService.cellsArr.find((e)=>{
    return e.props.x === x && e.props.y === y
  })
  if(currentCell && currentCell.props.checker.props.isKing === true){
    return canMoveKing(x,y) 
  } 
  let res:{x:number,y:number}[] = [] 
  if(sharedService.turnToMove == 1){
    findToMove(x,y,1,1)
    findToMove(x,y,-1,1)
  } else{
    findToMove(x,y,1,-1)
    findToMove(x,y,-1,-1)
  }
  
function findToMove(x:number,y:number,X:number,Y:number){
  
  let neigberX:number 
  let neigberY:number 
  neigberX = x+X
  neigberY = y+Y
  
  let findedCell = sharedService.cellsArr.find((e)=>{
    return e.props.x ===  neigberX && e.props.y ===  neigberY 
  })      
  if(findedCell && findedCell?.props?.checker == null ){
    res.push({x:neigberX,y:neigberY})
  }
}
return res
}

export const canMoveKing:Filds = (x,y)=>{
  let res:{x:number,y:number}[] = [] 
  
    findToMove(x,y,1,1)
    findToMove(x,y,-1,1)
    findToMove(x,y,1,-1)
    findToMove(x,y,-1,-1)
 
  
function findToMove(x:number,y:number,X:number,Y:number){
  
  let neigberX:number 
  let neigberY:number 
  neigberX = x+X
  neigberY = y+Y
  
  let findedCell = sharedService.cellsArr.find((e)=>{
    return e.props.x ===  neigberX && e.props.y ===  neigberY 
  })      
  if(findedCell && findedCell?.props?.checker == null ){
    res.push({x:neigberX,y:neigberY})
  }
}
return res
}



export const wherCanDrop:Filds = (x,y)=> {
  
  let res:{x:number,y:number}[] = [] 
  fildToHit(x,y,1,1)
  fildToHit(x,y,-1,1)
  fildToHit(x,y,-1,-1)
  fildToHit(x,y,1,-1)

  function fildToHit (x:number,y:number,X:number,Y:number){
    let neigberX:number 
    let neigberY:number 
    neigberX = x+X
    neigberY = y+Y

    let findedCell = sharedService.cellsArr.find((e)=>{
      return e.props.x ===  neigberX && e.props.y ===  neigberY 
    })      
    if(findedCell && findedCell.props.checker && findedCell.props.checker.props.player !== sharedService.turnToMove){
      neigberX = x+X*2
      neigberY = y+Y*2

      findedCell = sharedService.cellsArr.find((e)=>{
        return e.props.x ===  neigberX && e.props.y ===  neigberY 
      })
      if(findedCell && findedCell.props.checker == null){
        res.push({x:neigberX,y:neigberY})
      }
    }
  }
  return res
}

export const  arrOfFildsWherCanHit =()=>{
  let arrOf:any[] = []
  let filtered = sharedService.cellsArr.filter(e=>{
    return e.props?.checker?.props.player === sharedService.turnToMove
  })
  filtered.forEach(e=>{
    arrOf.push(wherCanDrop(e.props.x,e.props.y)) 
  })
  return arrOf
}

export const  whoCanHit = (x:number,y:number)=>{
  if(wherCanDrop(x,y).length !== 0){
    return {x:x,y:y}
  } else{
    return null
  }
}

const getBestStep:()=>{x:number,y:number} = function(){

    
  let steps = recursion(sharedService.enemy!.x,sharedService.enemy!.y,0,1,sharedService.player!.x,sharedService.player!.y,null,0)
  // console.log("bot" + sharedService.enemy!.x,sharedService.enemy!.y);
  
  // console.log(sharedService.player!.x,sharedService.player!.y);

  // steps = steps.filter((e)=>{
  //   return  e.zparentStep !== null 
  // })
console.log(steps.length);

  steps.sort((a,b)=>{
    let byExp = ( b.expectation as number) - (a.expectation as number)
    let byStepNmbr =  ( b.stepNumber as number)  - (a.stepNumber as number)
      return     byExp  ||  byStepNmbr
  })

  //console.log(steps);
  
  arrOfAllSteps = steps
  
  
  
  return {x:steps[0].x,y:steps[0].y}
}

const Cell: React.FC<CellProps> = (props:CellProps  ) => {
  

 

  function moveToCoord(fromX:number,fromY:number,toX:number,toY:number){
    console.log(fromX,fromY,toX,toY);
    
    let newArr:any =  [...sharedService.cellsArr];  
    
    let checker:any 
    newArr.forEach((e:any,index:any)=>{
      let deletedChecker = !(e.props.x == fromX && e.props.y == fromY)
      
      
      if(!deletedChecker){
        checker = {
          ...e.props,
          checker:<Checker {...{...e.props,x:toX,y:toY,setArr:props.setArr,isKing:true}}></Checker>,
          key:Math.random()*1000,
        }
        let copiedProps = {...e.props,checker:null}
        console.log(copiedProps);

        copiedProps.key = Math.random()*1000 
        newArr[index] = <Cell {...copiedProps} ></Cell>
      }
    })
    console.log(checker);
    
    newArr.forEach((e:any,index:any)=>{
      if(e.props.x == toX && e.props.y == toY){
        newArr[index] = <Cell {...checker} ></Cell>
      }
    })


    props.setArr(newArr)
    sharedService.cellsArr = newArr
  }

  function isCurrStepGood(steps:Step[]):boolean  {

    
    return true
  }



  function handleDragOver(e:any){
    if(e.target.classList.contains("canDrop")){
      e.target.classList.add("over")
      e.preventDefault();
    }
  }


  function handleDragLeave(e:any){
    if(e.target.classList.contains("canDrop")){
      e.target.classList.remove("over")
      e.preventDefault();
    }
  }



  const left = props.x * size - size
  const top = props.y * size - size
  return <div id={props.x.toString() + props.y.toString()} onDrop={(e)=>{handleDrop(e,props)}} onDragOver={handleDragOver}  onDragLeave={handleDragLeave} className={styles.cell + " " + (props.canDrop? "canDrop": "notCanDrop")}   
  style={{backgroundColor:props.color,left:left,top:top,width:size,height:size}}>
      {props.checker}
      {props.x}
      {props.y}
  </div>;
};

export default Cell;

