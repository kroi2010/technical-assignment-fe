import {initializePreGame} from "./pregame";
import {resetGame} from "./game";
import {showWinAnimation, hideWinAnimation} from "./renderUI";
import {strings} from "../constants";

let firstInitiation = true;

const addListeners = () => {
    const restartBtn = document.getElementById("restartGame");
    restartBtn.addEventListener("click", () => {
        resetGame();   
        initializePreGame();
        hideWinAnimation();
    })
}

const determineWinner = (roundResult) => {
    let won = 0;
    let lost = 0;

    roundResult.forEach(result => {
        if(result==="won"){
            won++;
        }else if(result==="lost"){
            lost++;
        }
    });

    let result;
    let msg;
    let header;
    if(won>lost){
        result = "You won!";
        msg = strings.wonMsg;
        header = strings.wonHeader;
    }else if(won<lost){
        result = "Computer won!";
        msg = strings.lostMsg
    }else{
        result = "It's a tie!";
        msg = strings.tieMsg;
    }

    console.error(result);
    showWinAnimation(header, msg);
}

const initializeWinAnimation = (roundResult) => {
    determineWinner(roundResult);
    
    if(firstInitiation){
        addListeners();
        firstInitiation = false;
    }
}

export {initializeWinAnimation};