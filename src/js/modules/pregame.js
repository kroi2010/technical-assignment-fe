import {
    select,
    deselect,
    displayRound,
    renderGameOption,
    showPreGameScreen,
    showGameScreen} from "./renderUI";
import {getRoundNumber, initializeGame} from "./game";
import WeaponList from "../data/weapons.json";
import Weapon from "./weapons";

let allWeapons = [];
let firstInitiation = true;

const addListeners = () => {
    const startGameBtn = document.getElementById("startGame");

    startGameBtn.addEventListener("click", () => {
        displayRound(getRoundNumber());
        let activeWeapons = allWeapons.filter(weapon => {
            return weapon.active === true;
        });

        setTimeout(() => {
            showGameScreen();
            initializeGame(activeWeapons);
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

const initializePreGame = () => {
    if(firstInitiation){
        addAllWeapons();
        addListeners();
        firstInitiation = false;
    }
    showPreGameScreen();
}

export {initializePreGame};