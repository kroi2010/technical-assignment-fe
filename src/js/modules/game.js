import {
    addClick,
    removeClick,
    fadeIn,
    fadeOut,
    select,
    deselect,
    clearDOM,
    colorRoundNumber,
    displayRound,
    renderGameOption} from "./renderUI";
import {strings} from "../constants";
import{initializeWinAnimation} from "./winAnimation"

let activeWeapons = [];
let activeWeaponChoices  = []; // all weapons elements that were activated for game
let roundNumber = 1;
let roundResult = [];

const createActiveWeapons = (activeWeaponObjects) => {
    activeWeapons = [...activeWeaponObjects]
}

const createActiveWeaponChoices = () => {
    let optionsContainer = document.getElementById("choiceList");
    activeWeaponChoices = activeWeapons.map(weapon => {
        return renderGameOption(weapon, optionsContainer);
    });
}

const prepareObjects = (activeWeaponObjects) => {
    createActiveWeapons(activeWeaponObjects);
    createActiveWeaponChoices();
}

const hideChoices = () => {
    activeWeaponChoices.forEach(el => {
        removeClick(el)
        if(!el.classList.contains("selected")){
            fadeOut(el);
        }
    })
}

const randomChoice = () => {
    return Math.floor(Math.random()*activeWeaponChoices.length);
}

const getResult = (choice) => {
    let userChoice = activeWeapons.find(obj => obj.name === choice);
    let computerChoice = activeWeapons[randomChoice()];
    let result;
    if(userChoice.winAgainst.includes(computerChoice.name)){
        result = strings.won;
    }else if(computerChoice.winAgainst.includes(userChoice.name)){
        result = strings.lost;
    }else{
        result = strings.tie;
    }
    roundResult.push(result);
    colorRoundNumber(roundNumber, result);

    roundNumber++;

    setTimeout(() => {
        playRound();
    }, 6000);
}

const autoPlaySelect = () => {
    let autoChoice = activeWeaponChoices[randomChoice()];
    autoChoice.click();
}

const getRoundNumber = () => {
    return roundNumber;
}

const enableChoices = () => {
    activeWeaponChoices.forEach(weapon => {
        addClick(weapon);
    });
}

const disableChoices = () => {
    activeWeaponChoices.forEach(weapon => {
        removeClick(weapon);
    });
}

const disableEnableChoices = () => {
    if(document.getElementById("autoPlay").checked){
        disableChoices();
    }else{
        enableChoices();
    }
}

const resetChoiceStyling = () => {
    activeWeaponChoices.forEach(weapon => {
        fadeIn(weapon)
        if(weapon.classList.contains("selected")){
            deselect(weapon);
        }
    })
}

const resetGame = () => {
    roundNumber = 1;
    activeWeapons = [];
    activeWeaponChoices  = []; 
    roundResult = [];
    clearDOM(document.getElementById("choiceList"));    
}

const playRound = () => {
    if(roundNumber>1 && roundNumber<4){
        displayRound(roundNumber);

        setTimeout(() => {
            disableEnableChoices();
            resetChoiceStyling();
        }, 2000); // allow round animation to start
    
        setTimeout(() => {
            if(document.getElementById("autoPlay").checked){
                autoPlaySelect();
            }
        }, 5000); // giving user 3 ( + animation ) seconds in case he wants to switch to manual mode   
    }else if(roundNumber>=4){
        initializeWinAnimation(roundResult);
        resetGame();
    }
}

const initializeGame = (activeWeaponObjects) => {
    prepareObjects(activeWeaponObjects);
    addListeners();
    playRound();
}

const addListeners = () => {
    const radioButton = document.getElementById("autoPlay");
    radioButton.addEventListener("change", () => {
        if(document.getElementById("autoPlay").checked){
            autoPlaySelect();
        }
    });

    activeWeaponChoices.forEach(el => {
        el.addEventListener("click", () => {
            let classList = el.classList;
            let userChoice = null;
            classList.forEach(className => {
                if(className!=="choice" && className!=="selected"){
                    userChoice = className;
                }
            })
            select(el);
            hideChoices();
            getResult(userChoice);
        });
    })
}


export {
    initializeGame, 
    getRoundNumber
};