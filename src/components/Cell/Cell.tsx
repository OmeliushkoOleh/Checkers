import * as React from "react";
import styles from './Cell.module.css';
import Checker, { CheckerProps, Player } from '../Checker/Checker'
import { sharedService } from "../SharedService";
export type cellColor = "white"|"black";
export type CellProps = {
  x:number,
  y:number,
  color:cellColor,
  checker: any,
  canDrop:boolean,
  setArr:React.Dispatch<React.SetStateAction<never[]>>,
};
export  const size = 100

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
    let neigberX:number = x 
    let neigberY:number = y
    let findedCell:any 
    let findedChecker  

    do{
      neigberX = neigberX + X
      neigberY = neigberY + Y
      findedCell = sharedService.cellsArr.find((e)=>{
        return e.props.x ===  neigberX && e.props.y ===  neigberY 
      })
      findedChecker = findedCell? findedCell.props.checker: null  
      if(findedChecker == null){
        res.push({x:neigberX,y:neigberY})
      }
    }while(findedCell && findedChecker == null)

  }  
  return res
}

export const wherCanKingDrop:Filds = (x,y)=>{
  let res:{x:number,y:number}[] = [] 
  
  fildToHit(x,y,1,1)
  fildToHit(x,y,-1,1)
  fildToHit(x,y,-1,-1)
  fildToHit(x,y,1,-1)

  function fildToHit (x:number,y:number,X:number,Y:number){
    let neigberX:number = x 
    let neigberY:number = y
    let findedCell:any 
    let findedChecker 
    let enemyCount = 0

    do{
      neigberX = neigberX + X
      neigberY = neigberY + Y
      findedCell = sharedService.cellsArr.find((e)=>{
        return e.props.x ===  neigberX && e.props.y ===  neigberY 
      })
      if(findedCell && findedCell.props.checker && findedCell.props.checker.props.player === sharedService.turnToMove){
        return
      }
      if(findedCell && findedCell.props.checker && findedCell.props.checker.props.player !== sharedService.turnToMove){
        enemyCount++
      }
      if(findedCell && enemyCount==1 && findedCell.props.checker == null){
        res.push({x:neigberX,y:neigberY})
      }
    } while(findedCell && findedChecker == null)
  }
// export const wherCanKingDrop:Filds = (x,y)=>{
//   let res:{x:number,y:number}[] = [] 
  
//   fildToHit(x,y,1,1)
//   fildToHit(x,y,-1,1)
//   fildToHit(x,y,-1,-1)
//   fildToHit(x,y,1,-1)

//   function fildToHit (x:number,y:number,X:number,Y:number){
//     let neigberX:number = x 
//     let neigberY:number = y
//     let findedCell:any 
//     let findedChecker 
    
//     do{
//       neigberX = neigberX + X
//       neigberY = neigberY + Y
//       findedCell = sharedService.cellsArr.find((e)=>{
//         return e.props.x ===  neigberX && e.props.y ===  neigberY 
//       })
//         let neigberX1:any = neigberX
//         let neigberY1:any = neigberY
//       if(findedCell && findedCell.props.checker && findedCell.props.checker.props.player === sharedService.turnToMove){
//         return
//       }
//       if(findedCell && findedCell.props.checker && findedCell.props.checker.props.player !== sharedService.turnToMove){
//         do{
//           debugger
//           neigberX1 = neigberX1 + X
//           neigberY1 = neigberY1 + Y
//           findedCell = sharedService.cellsArr.find((e)=>{
//             return e.props.x ===  neigberX1 && e.props.y ===  neigberY1 
//           })
//           findedChecker = findedCell? findedCell.props.checker: null  
//           if(findedChecker == null){
//             res.push({x:findedCell?.props?.x,y:findedCell?.props?.y})
//           }
//         } while(findedCell && findedChecker == null)
//       }
//     } while(findedCell && findedChecker == null)
//   }





  return res
}

export const wherCanDrop:Filds = (x,y)=> {
  debugger
  let currentCell = sharedService.cellsArr.find((e)=>{
    return e.props.x === x && e.props.y === y
  })
  if(currentCell && currentCell.props.checker && currentCell.props.checker.props?.isKing === true){
    return wherCanKingDrop(x,y) 
  } 
  let res:{x:number,y:number}[] = [] 
  fildToHit(x,y,1,1)
  fildToHit(x,y,-1,1)
  fildToHit(x,y,-1,-1)
  fildToHit(x,y,1,-1)

  function fildToHit (x:number,y:number,X:number,Y:number){
    debugger
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

const Cell: React.FC<CellProps> = (props:CellProps  ) => {
  
  function handleDrop(e:any) { 
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
    // sharedService.cellsArr.forEach((Element:any,index) => {
      
    //   const x = Element.props.x
    //   const y = Element.props.y
    //   const color = Element.props.color
    //   let checker = Element.props.checker
    //   // if(Element.props === props){
        
    //   //   let isKing:boolean = data.isKing
    //   //   if(data.player === 1 && props.y === 8){
    //   //     isKing = true
    //   //   }  else if (data.player === 2 && props.y === 1){
    //   //     isKing = true
    //   //   }

          
    //   //   checker = <Checker isKing={isKing} player={data.player} x={Element.props.x} y={Element.props.y} arr={data.arr} setArr={sharedService.setArr} ></Checker>
    //   //   let arrToDel = []
    //   //   

    //   // if(data.x == x && data.y == y ){
    //   //   checker = null
    //   // }
    //   newArr.push(<Cell  setArr={sharedService.setArr} canDrop={false} x={x} y={y} color={color} key={index} checker={checker} ></Cell>)
    // });

    // if(needForRemove != null){
    //   newArr.forEach((e:any,index:any)=>{
    //     let deletedChecker = !(e.props.x == needForRemove!.x && e.props.y == needForRemove!.y)
    //     if(!deletedChecker){
    //       let copiedProps = {...e.props}
    //       copiedProps.checker = null          
    //       copiedProps.key = copiedProps.key*33
    //       newArr[index] = <Cell {...copiedProps} ></Cell>
    //     }
    //   })
    // }

        
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


      // sharedService.cellsArr.forEach((e)=>{
      //   if(whoCanHit(e.props.x,e.props.y) != null){
      //     console.log(whoCanHit(e.props.x,e.props.y));
      //   }
      // })
      
    
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
  return <div onDrop={handleDrop} onDragOver={handleDragOver}  onDragLeave={handleDragLeave} className={styles.cell + " " + (props.canDrop? "canDrop": "notCanDrop")}   
  style={{backgroundColor:props.color,left:left,top:top,width:size,height:size}}>
      {props.checker}
  </div>;
};

export default Cell;

