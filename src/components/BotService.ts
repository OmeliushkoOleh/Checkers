import { Player } from "./Checker/Checker"

/**
 * 
 * @param x текущая координата х
 * @param y текущая координата y
 * @param X координата х врага
 * @param Y координата у врага
 * @returns место куда можно походить
 */
export function wherCanStep(x:number,y:number,enemyX:number,enemyY:number){
    let arr:{x:number,y:number}[] = []

    fildToStep(x,y,1,1)
    fildToStep(x,y,-1,1)
    fildToStep(x,y,-1,-1)
    fildToStep(x,y,1,-1)

    function fildToStep(x:number,y:number,X:number,Y:number){
        let neigberX:number 
        let neigberY:number 
        neigberX = x+X
        neigberY = y+Y
        let isCellExist:boolean = 0 < neigberX && neigberX < 9 &&  0 < neigberY && neigberY < 9
        if(isCellExist && (neigberX !== enemyX ||neigberY !== enemyY) ){
            arr.push({x:neigberX,y:neigberY})
            if(neigberX == 0 || neigberY == 0){
                debugger
            }
        }
    }
    return arr
}

/**
 * 
 * @param x текущая координата х
 * @param y текущая координата y
 * @param X координата х врага
 * @param Y координата у врага
 * @returns место куда нужно походить
 */
export function wherNeedStep(x:number,y:number,enemyX:number,enemyY:number){
    let arr:{x:number,y:number}[] = []
     
    fildToHit(x,y,1,1)
    fildToHit(x,y,-1,1)
    fildToHit(x,y,-1,-1)
    fildToHit(x,y,1,-1)

    function fildToHit (x:number,y:number,X:number,Y:number){
        let neigberX:number 
        let neigberY:number 
        neigberX = x+X
        neigberY = y+Y
        let isCellExist:boolean = 0 < neigberX && neigberX < 9 &&  0 < neigberY && neigberY < 9
              
        if(isCellExist && neigberX == enemyX && neigberY == enemyY){
          neigberX = x+X*2
          neigberY = y+Y*2
          let isCellExist:boolean = 0 < neigberX && neigberX < 9 &&  0 < neigberY && neigberY < 9
          
          if(isCellExist){
            arr.push({x:neigberX,y:neigberY})
            if(neigberX == 0 || neigberY == 0){
                debugger
            }
          }
        }
      }
    return arr
}

export interface Step  {
    zparentStep:Step|null,
    x:number,
    y:number,
    expectation:number,
    stepNumber:number,
    moveBy:string,
    childStep:Step|null,
}
const maxSteps = 4
let arrOfSteps:Step[] = []
let result:Step 

let bot:Player  

export function recursion(dx:number,dy:number,stepNumber:number,player:Player,X:number,Y:number,prevStep:Step|null,needReturn:number):Step[]{
    
    if (stepNumber ==  0) {
        arrOfSteps = []
        bot = player
    } 

    let step = {
        zparentStep: prevStep,
        x:dx,
        y:dy,
        expectation: expectation(dx,dy,X,Y,stepNumber)+ needReturn,
        stepNumber:stepNumber,
        moveBy:player == 1 ? "bot" : "player",
        childStep:null
    }

    stepNumber++
    if(stepNumber <= maxSteps ){
        let arrOfSteps1 = wherNeedStep(dx,dy,X,Y)
        if(arrOfSteps1.length === 0){
            arrOfSteps1 = wherCanStep(dx,dy,X,Y)
        } else{
            if(bot == player ){
                needReturn = (needReturn as number) + 111
            }
        }
        arrOfSteps1.forEach((e)=>{
            let currentPlayer:Player = player == 1 ? 2 : 1
            recursion(X,Y,stepNumber,currentPlayer,e.x,e.y,step,needReturn)
        })
    } 
    if(prevStep){
        prevStep.childStep = step
    }

        arrOfSteps.push(step)


    return arrOfSteps
}   

/**
 * 
* @param x текущая координата "х" того чей ход
 * @param y текущая координата "y" того чей ход
 * @param X координата "х" врага
 * @param Y координата "у" врага 
 */
export function expectation(x:number,y:number,X:number,Y:number,stepNumber:number):number{
    let exp:number = 1
    // if(x === 6 && y === 4 && X === 5 && Y ===7 ||
    //    x === 4 && y === 4 && X === 5 && Y ===7 ||
    //    x === 5 && y === 3 && X === 2 && Y ===4 ||
    //    x === 5 && y === 5 && X === 2 && Y ===4 ||
    //    x === 3 && y === 5 && X === 4 && Y ===2 ||
    //    x === 5 && y === 5 && X === 4 && Y ===2 ||
    //    x === 4 && y === 4 && X === 7 && Y ===6 ||
    //    x === 4 && y === 6 && X === 7 && Y ===6 

    // //    X === 8  && Math.abs(y-Y) === 1 ||
    // //    x === 5 && y === 3 && X === 8 && Y === 4 ||
    // //    x === 5 && y === 5 && X === 8 && Y === 4 ||
    // //    x === 5 && y === 3 && X === 8 && Y === 4 ||
    // ){
    //     exp = 100
    // } else 
    if(wherNeedStep(x,y,X,Y).length !== 0){
        exp = 100
    } else if(wherNeedStep(X,Y,x,y).length !== 0){
        exp = 0
    }   else if(wherCanStep(x,y,X,Y).length !== 0){
        exp = 50
    }
    if( stepNumber === 0){
        stepNumber = 1 / 100
    }
    exp = 10/stepNumber + exp
    return exp
}