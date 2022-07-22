import * as React from "react";
import Cell from "../Cell";
import { arrOfFildsWherCanHit,  arrOfFildsWherCanMove,  cellColor, ICellComponent, IGemeDataInterface } from "../Cell/Cell";
import styles from './Fild.module.css'
import Checker, { CheckerProps, Player } from '../Checker/Checker'
import {  Iobj, sharedService } from "../SharedService";

type FildProps = {
  //
};

//dfdg


const Fild: React.FC<any> = () => {

  const [turnToMove, setTurnToMove] = React.useState<Player> (1)
  sharedService.setTurnToMove = setTurnToMove

  
  const [arr , setArr]= React.useState<JSX.Element[]>([])
  sharedService.setArr = setArr

  React.useEffect(()=>{



    const startNewGame = ()=>{
      let cellsArray:any = []
      let counter = 0
      for(let x = 1;x <=8; x++){
        for(let y = 1;y <=8; y++){
          counter++
          let color:cellColor 
          let checker:any | null
          let xEven = x % 2 == 0
          let yEven = y % 2 == 0
          const condition = (xEven && yEven) || (!xEven && !yEven)
          if(condition){
            color = "white";
            if(y<4){
              checker = <Checker isKing={false} arr={arr} setArr={setArr} x={x} y={y} player={1}></Checker>
            } 
            if(y>5){
              checker = <Checker isKing={false} arr={arr} setArr={setArr} x={x} y={y} player={2}></Checker>
            }
          } else{
            color = "black"
            checker = null
          }
          let comp = <Cell canDrop={false} setArr={setArr} x={x} y={y} color={color} key={counter} checker={checker}></Cell>
          cellsArray.push(comp)
        }
      } 
      setArr(()=>{return cellsArray;})
      sharedService.cellsArr = cellsArray
      

    }
    const continGame = (gameData:IGemeDataInterface)=>{
      
      let cellsArray:JSX.Element[] = []
      gameData.cells.forEach(e=>{
        let checkersData = gameData.checkers.find(el=>el.x===e.x && el.y===e.y) 
        let checker
        if(checkersData){
          checker = <Checker key={Math.random()*222} player={checkersData.player} x={checkersData.x} y={checkersData.y} arr={arr} setArr={setArr} isKing={checkersData.isKing}></Checker>
        }
        let cell = <Cell key={Math.random()*222} x={e.x} y={e.y} color={e.color} checker={checker} canDrop={e.canDrop} setArr={setArr}></Cell>
        cellsArray.push(cell)
      })
      let checkerWhoHit:CheckerProps|null = {
        x:gameData.checkerWhoHit!?.x,
        y: gameData.checkerWhoHit!?.y,
        player:gameData.checkerWhoHit!?.player ,
        arr: arr,
        isKing: gameData.checkerWhoHit!?.isKing,
        setArr:setArr 
      }
      let sharedService1:Iobj = {
        coordinates: {
          x: gameData.coordinates.x,
          y: gameData.coordinates.y
        },
        turnToMove: gameData.turnToMove,
        checkerWhoHit: checkerWhoHit,
        setArr:setArr,
        setTurnToMove:setTurnToMove,
        cellsArr:cellsArray,

      }
      sharedService.cellsArr = sharedService1.cellsArr
      sharedService.checkerWhoHit = sharedService1.checkerWhoHit
      sharedService.coordinates = sharedService1.coordinates
      sharedService.setArr = setArr
      sharedService.setTurnToMove = setTurnToMove
      sharedService.turnToMove = sharedService1.turnToMove
      setArr(cellsArray)
      setTurnToMove(gameData.turnToMove)
    }


    let data = localStorage.getItem("gameData")
    let gameData:IGemeDataInterface = JSON.parse(data!)
    if(gameData){
      continGame(gameData)
    } else{
      startNewGame()
    }
    
    
    },[]) 
  
  
  const [winner, setWinner] = React.useState("")

  React.useEffect(()=>{
    
    let arrOfPlayerCheckers1:ICellComponent[] = [] 
    let arrOfPlayerCheckers2:ICellComponent[] = [] 

    sharedService.cellsArr.forEach((e)=>{
      if(e.props.checker != null && e.props.checker.props.player == 1){
        arrOfPlayerCheckers1.push(e)
      }
      if(e.props.checker != null && e.props.checker.props.player == 2){
        arrOfPlayerCheckers2.push(e)
      }
    })

    let bouth = [...arrOfFildsWherCanHit(),...arrOfFildsWherCanMove()]
    let someCanMoveOrHit = bouth.some(e=>{
      return e.length !== 0
    })
   
    sharedService.cellsArr.forEach(()=>{

    })
    
    if(arrOfPlayerCheckers1.length == 0 || (!someCanMoveOrHit && sharedService.turnToMove === 1)){
      setWinner("Игрок 2 победил")
      alert("Игрок 2 победил")
    }
    if(arrOfPlayerCheckers2.length == 0 || (!someCanMoveOrHit && sharedService.turnToMove === 2)){
      setWinner("Игрок 1 победил")
      alert("Игрок 1 победил")
    }

    
  },[arr])
  
  let text =  winner || "Ход игрока" + turnToMove
  
  return <div className={styles.fild}>
     {arr.length&&arr} 
     <div className="turnToMove"> 
     {text}<br/><br/>
     <div className="player" >Игрок 1: <img  width="100px" height="100px" src="https://pngimg.com/uploads/checkers/checkers_PNG17.png" ></img></div>
     <br/>
     <div className="player" >Игрок 2: <img  width="100px" height="100px" src={url} ></img></div>
     </div>
  </div>;
};

export default Fild;

let url= "data:image/png;base64,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"

