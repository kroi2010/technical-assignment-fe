import {
    addClick,
    removeClick,
    fadeIn,
    fadeOut,
    select,
    deselect,
    returnPosition,
    clearChoiceList,
    fadeInRoundDisplay,
    fadeOutRoundDisplay,
    hideComputerChoice,
    hideAnnouncement,
    resetRoundNumbers,
    renderGameOption,
    showGameScreen,
    showRoundOutcome
} from "./renderUI";
import {strings} from "../constants";
import{initializeWinAnimation} from "./winAnimation"

let activeWeapons = [];
let activeWeaponChoices  = []; // all weapons elements that were activated for game
let roundNumber = 1;
let roundResult = [];
let autoChoiceMade = false;
let firstInitiation = true;

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
    for(let i=0; i<activeWeaponChoices.length;i++){
        removeClick(activeWeaponChoices[i])
        if(!activeWeaponChoices[i].classList.contains("selected")){
            fadeOut(activeWeaponChoices[i]);
        }
    }
}

const randomChoice = () => {
    return Math.floor(Math.random()*activeWeaponChoices.length);
}

const showResult = (selectedEl) => {
    let weaponName = [...selectedEl.classList].find(weaponClass => (weaponClass!=="selected" && weaponClass!=="choice"));
    let userChoice = activeWeapons.find(obj => obj.name === weaponName);
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

    new Promise((resolve) => {
        showRoundOutcome(resolve, selectedEl, computerChoice.name, result, roundNumber);
    })
    .then(() => roundNumber++)
    .then(() => {
        if(roundNumber<4){
            return new Promise((resolve) => fadeInRoundDisplay(resolve, roundNumber))
            .then(() => false);
        }else{
            return true;
        }
    })
    .then((lastRound) => {
        hideComputerChoice(); // hides opp - always need
        hideAnnouncement();     // hides win message - always need
        fadeIn(document.getElementById("message")); //brings back choose msg - always need
        if(lastRound){
            initializeWinAnimation(roundResult);    //start win animation
        }else{
            disableEnableChoices(); // enables click on choices - not needed in the last since choices will be detroyed
            resetChoiceStyling();   //styling reset for choices - not needed in last one
            startNewRound();    // not needed in last one
        }
    })
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
    for(let i=0; i<activeWeaponChoices.length; i++){
        fadeIn(activeWeaponChoices[i]);
        if(activeWeaponChoices[i].classList.contains("selected")){
            returnPosition(activeWeaponChoices[i]);
            deselect(activeWeaponChoices[i]);
        }
    }
}

const resetGame = () => {
    roundNumber = 1;
    activeWeapons = [];
    activeWeaponChoices  = []; 
    roundResult = [];
    resetRoundNumbers();
    clearChoiceList();    
}

const startNewRound = () => {
    new Promise((resolve) => {
        fadeOutRoundDisplay(resolve);
    }).then(() => {
        autoChoiceMade = false;
        addClick(document.getElementById("autoPlay"));
        addClick([...document.getElementById("autoPlay").parentElement.getElementsByTagName("label")].find(l => l.htmlFor==="autoPlay"));
        setTimeout(() => {
            if(document.getElementById("autoPlay").checked && !autoChoiceMade){
                autoChoiceMade = true;
                autoPlaySelect();
            }
        }, 3000); // giving user some time in case he wants to switch to manual mode
    })
}

const initializeGame = (activeWeaponObjects) => {
    showGameScreen();
    prepareObjects(activeWeaponObjects);
    addListeners();
    startNewRound();
}

const userMadeChoice = (el) => {
    select(el);
    hideChoices();
    showResult(el);
}

const addListeners = () => {
    let radioButton = document.getElementById("autoPlay");

    if(firstInitiation){
        firstInitiation = false;
        radioButton.addEventListener("change", () => {
        if(document.getElementById("autoPlay").checked){
            autoChoiceMade = true;
            autoPlaySelect();
        }
    });
    }

    activeWeaponChoices.forEach(el => {
        el.addEventListener("click", () => {
            removeClick(radioButton);
            removeClick([...radioButton.parentElement.getElementsByTagName("label")].find(l => l.htmlFor===radioButton.id));
            userMadeChoice(el);
        });
    })
}


export {
    initializeGame, 
    getRoundNumber,
    resetGame
};