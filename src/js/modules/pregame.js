import {
    select,
    deselect,
    fadeInRoundDisplay,
    renderGameOption,
    showPreGameScreen} from "./renderUI";
import {getRoundNumber, initializeGame} from "./game";
import WeaponList from "../data/weapons.json";
import Weapon from "./weapons";

// all weapons that are currently supported by the game
let allWeapons = [];

// flag to avoid even listener stacking
let firstInitiation = true;

/**
 * Import all weapons that are supported 
 */
const addAllWeapons = () => {
    WeaponList.weapons.forEach(element => {
        allWeapons.push(new Weapon(element.name, element.winAgainst, element.active))
    });

    let optionsContainer = document.getElementById("allOptions");
    allWeapons.forEach(weapon => {
        let domObj = renderGameOption(weapon, optionsContainer);
        if(weapon.active){
            select(domObj);
        }
    });
}

/**
 * Add listeners to main action objects
 * Objects: start button, weapon choices
 */
const addListeners = () => {
    const startGameBtn = document.getElementById("startGame");

    startGameBtn.addEventListener("click", () => {
        new Promise((resolve) => {
            fadeInRoundDisplay(resolve, getRoundNumber());
        }).then(() => {
            initializeGame(activeWeapons);
        });
        let activeWeapons = allWeapons.filter(weapon => {
            return weapon.active === true;
        });

        setTimeout(() => {
            
            
        }, 2000)
    });

    let optionsContainer = document.getElementById("allOptions");
    let allChoices = [...optionsContainer.getElementsByClassName("choice")];
    allChoices.forEach(choice => {
        choice.addEventListener("click", () => {

            let choiceClass = [...choice.classList].filter(cls => {
                return cls !== "choice";
            });

            if(choice.classList.contains("selected")){
                let currentlySellected = allChoices.filter(choice => {
                    return choice.classList.contains("selected");
                })
                if(currentlySellected.length>3){
                    deselect(choice);
                for(let i=0; i<allWeapons.length;i++){
                    if(allWeapons[i].name===choiceClass[0]){
                        allWeapons[i].active=false;
                    }
                }
                }
            }else{
                select(choice);
                for(let i=0; i<allWeapons.length;i++){
                    if(allWeapons[i].name===choiceClass[0]){
                        allWeapons[i].active=true;
                    }
                }
            }
        })
    })
}

/**
 * Setup pre game screen for use
 */
const initializePreGame = () => {
    if(firstInitiation){
        addAllWeapons();
        addListeners();
        firstInitiation = false;
    }
    showPreGameScreen();
}

export {initializePreGame};