const gridSize=4;
let score=0;
let board=[];

let prevScore=0;
let prevBoard=[];
let undoUsed=false;

const cells=document.querySelectorAll(".cell");
const scoreBoard=document.querySelector(".score");
const restartBtn=document.querySelector(".restart-btn");
const undoBtn=document.querySelector(".undo-btn");

const initGame=()=>{
    board= new Array(gridSize*gridSize).fill(0);
    score=0;
    updateScore();
    generateNumber();
    generateNumber();
    renderBoard();
    localStorage.removeItem("2048-board");
    localStorage.removeItem("2048-score");
}

const generateNumber = () =>{
    const emptyCells=[];
    board.forEach((val,index) =>{
        if(val === 0) emptyCells.push(index);
    })

    if (emptyCells.length == 0) return;
    let randNumber=emptyCells[Math.floor(Math.random()*emptyCells.length)];
    board[randNumber]=Math.random()<0.9?2:4;

}

const renderBoard=()=>{
    board.forEach((val,i) =>{
        const cell=cells[i];
        cell.innerText=val ===0 ?"":val;
        cell.style.backgroundColor=getTileColor(val);
        cell.style.color = val > 4 ? "#fff" : "#333";

    })
}

const getTileColor=(val)=>{
    const colors = {
        0: "#cdc1b4",
        2: "#eee4da",
        4: "#ede0c8",
        8: "#f2b179",
        16: "#f59563",
        32: "#f67c5f",
        64: "#f65e3b",
        128: "#edcf72",
        256: "#edcc61",
        512: "#edc850",
        1024: "#edc53f",
        2048: "#edc22e",
    };

    return colors[val] || "#3c3a32";
}

const updateScore=()=>{
    scoreBoard.innerText=score;
}

const slide=(row)=>{
    let arr=row.filter(val => val !==0);
    for(let i=0; i<arr.length-1; i++){
        if(arr[i]===arr[i+1]){
            arr[i]=arr[i]*2;
            score+=arr[i];
            arr[i+1]=0;
        }
    }
    let result=arr.filter(val => val !==0);
    while(result.length<gridSize){
        result.push(0);
    }
    return result;
};

const rotateBoardClockwise=(matrix)=>{
    const newBoard=[];
    for(let col=0; col<gridSize; col++){
        for(let row=gridSize-1; row>=0; row--){
            newBoard.push(matrix[row*gridSize+col]);
        }
    }
    return newBoard;
}
const rotateBoardCounterClockwise=(matrix)=>{
    const newBoard=[];
    for(col=gridSize-1; col>=0; col--){
        for(row=0; row<gridSize; row++){
            newBoard.push(matrix[row*gridSize+col]);
        }
    }
    return newBoard;
}
const move=(direction)=>{
    let newBoard=[...board];
    let moved=false;

    if(direction === "left" || direction ==="right"){
        for(let i=0; i<gridSize; i++){
            let row=newBoard.slice(i*gridSize,(i+1)*gridSize);
            if(direction === "right") row.reverse();
            let newRow=slide(row);
            if(direction ==="right") newRow.reverse();
            for(let j=0; j<gridSize; j++){
                if(newBoard[i*gridSize+j] !== newRow[j]) moved=true;
                newBoard[i*gridSize+j]=newRow[j];
            }
        }
    }
    else if (direction ==="up" || direction ==="down"){
        newBoard= direction === "down" ? rotateBoardClockwise(board):rotateBoardCounterClockwise(board);
        for(let i=0; i<gridSize; i++){
            let row=newBoard.slice(i*gridSize,(i+1)*gridSize);
            let newRow=slide(row);
            for(let j=0; j<gridSize; j++){
                    if(newBoard[i*gridSize+j] !== newRow[j]) moved=true;
                    newBoard[i*gridSize+j]=newRow[j];
            }
        }
        newBoard= direction === "down" ? rotateBoardCounterClockwise(newBoard): rotateBoardClockwise(newBoard);


    }
    if(moved){
        prevBoard=[...board];
        prevScore=score;
        undoUsed=false;
        board=newBoard;
        generateNumber();
        renderBoard();
        updateScore();
        saveGame();
    }

    if(gameOver()){
        setTimeout(()=>{
            alert("Game Over!!!!!");
        },200);
    }
}

const gameOver=()=>{
    for(let i=0; i<board.length; i++){
        if(board[i]===0) return false;
        if(i%gridSize !== gridSize-1 && board[i]===board[i+1]) return false;
        if(i< gridSize*(gridSize-1) && board[i]===board[i+gridSize]) return false;

    }
    return true;
}

window.addEventListener("keydown",e=>{
    switch(e.key){
        case "ArrowLeft":
            move("left")
            break;
        case "ArrowRight":
            move("right");
            break;
        case "ArrowUp":
            move("up");
            break;
        case "ArrowDown":
            move("down");
            break;
            
    }
})

const undo=()=>{
    if(undoUsed || !prevBoard || prevBoard.length ===0) return;

    board=[...prevBoard];
    score=prevScore;
    renderBoard();
    updateScore();
    undoUsed=true;
};


saveGame=()=>{
    localStorage.setItem("2048-board",JSON.stringify(board));
    localStorage.setItem("2048-score",score);
};

loadGame=()=>{
    const savedBoard=JSON.parse(localStorage.getItem("2048-board"));
    const savedScore=parseInt(localStorage.getItem("2048-score"));

    if( savedBoard && savedBoard.length === gridSize*gridSize){
        board=savedBoard;
        score=savedScore;
        renderBoard();
        updateScore();

    }
    else{
        initGame();
    }
}


restartBtn.addEventListener("click",initGame);
undoBtn.addEventListener("click",undo)
loadGame();