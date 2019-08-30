
const delay =  ((time) => { 
    
    return new Promise((resolve) => {

        return setTimeout(function(){
            resolve(true);
        }, time);  
    });
});

const renderGameOption = (option, parrent) => {
    let childElement = document.createElement('div');
    childElement.classList.add("choice");
    childElement.classList.add(option.name);

    let handElement = document.createElement('div');
    handElement.classList.add("hand");
    handElement.innerHTML = option.name;

    childElement.appendChild(handElement);
    parrent.appendChild(childElement);

    return childElement;
}
const addCls = (el, cls) => {
    el.classList.add(cls);
}

const removeCls = (el, cls) => {
    el.classList.remove(cls);
}

const fadeIn = (el) => {
    el.style.opacity = "1";
}

const fadeOut = (el) => {
    el.style.opacity = "0";
}

const select = (el) => {
    addCls(el, "selected")
}

const deselect = (el) => {
    removeCls(el, "selected");
}

const removeClick = (el) => {
    el.style.pointerEvents = "none";
}

const addClick = (el) => {
    el.style.pointerEvents = "all";
}

const hide = (el) => {
    el.style.display = "none";
}

const clearChoiceList = () => {
    [...document.getElementById("choiceList")
    .getElementsByClassName("choice")]
    .filter(choice => choice.id!=="computerChoice")
    .map(choice => choice.remove());
}

const showPreGameScreen = () => {
    let game = document.getElementById("game");
    let preGame = document.getElementById("preGame");
    let mainContainer = document.getElementById("gameContainer");
    hide(game);
    preGame.style.display = "flex";
    mainContainer.style.minHeight = preGame.clientHeight.toString()+"px";
}

const showGameScreen = () => {
    let game = document.getElementById("game");
    let preGame = document.getElementById("preGame");
    game.style.display = "flex";
    hide(preGame);
}

const fadeInOut = (el) => {
    if(getComputedStyle(el).opacity=="0"){
        fadeIn(el);
    }else{
        fadeOut(el);
    }
}

const selectDeselect = (el) => {
    if(el.classList.contains("selected")){
        deselect(el);
    }else{
        select(el);
    }
}

// const displayRound = (round) => {
//     let roundNumberEl = document.getElementById("roundNumber");
//     roundNumberEl.innerHTML = round;
//     const delayTime = 800;
//     delay(0)
//     .then(() => {
//         addClick(document.getElementById("roundContainer"));
//         fadeInOut(document.getElementById("roundContainer"));})
//     .then(() => delay(delayTime))
//     .then(() => fadeInOut(document.getElementById("roundText")))
//     .then(() => delay(delayTime))
//     .then(() => fadeInOut(document.getElementById("roundText")))
//     .then(() => delay(delayTime))
//     .then(() => {
//         removeClick(document.getElementById("roundContainer"));
//         fadeInOut(document.getElementById("roundContainer"));})
// }

const fadeInRoundDisplay = (resolve, round) => {
    let roundNumberEl = document.getElementById("roundNumber");
    roundNumberEl.innerHTML = round;
    const delayTime = 800;
    delay(0)
    .then(() => {
        addClick(document.getElementById("roundContainer"));
        fadeInOut(document.getElementById("roundContainer"));})
    .then(() => delay(delayTime))
    .then(() => fadeInOut(document.getElementById("roundText")))
    .then(() => delay(1000))
    .then(() => resolve());
}

const fadeOutRoundDisplay = (resolve) => {
    const delayTime = 800;
    delay(0)
    .then(() => fadeInOut(document.getElementById("roundText")))
    .then(() => delay(delayTime))
    .then(() => {
        removeClick(document.getElementById("roundContainer"));
        fadeInOut(document.getElementById("roundContainer"));})
    .then(() => delay(1000))
    .then(() => resolve());
}


const colorRoundNumber = (number, result) => {
    let roundNumbers = [...document.getElementsByClassName("round")];
    roundNumbers[number-1].classList.add(result);
    roundNumbers[number-1].getElementsByTagName("span")[0].innerHTML = result;
}

const resetRoundNumbers = () => {
    let roundNumbers = [...document.getElementsByClassName("round")];
    for(let i=0; i<roundNumbers.length; i++){
        let statusClass = [...roundNumbers[i].classList].find(cls => cls!=="round");
        roundNumbers[i].classList.remove(statusClass);
        roundNumbers[i].firstElementChild.innerHTML = "";
    }
}

const showWinAnimation = (header, msg) => {
    if(header){
        let winHeader = document.getElementById("winHeader");
        winHeader.innerHTML = header;
        winHeader.style.display = "block";
    }
    let winAnimationMsg = document.getElementById("winAnimationMsg");
    winAnimationMsg.innerHTML = msg;

    let winAnimation = document.getElementById("winAnimationContainer");
    fadeIn(winAnimation);
    addClick(winAnimation);
}

const hideWinAnimation = () => {
    hide(document.getElementById("winHeader"));
    let winAnimation = document.getElementById("winAnimationContainer");
    fadeOut(winAnimation);
    removeClick(winAnimation);
}

const startThinking = () => {
    let computerChoice = document.getElementById("computerChoice")
    addCls(computerChoice, "thinking");
}

const stopThinking = () => {
    let computerChoice = document.getElementById("computerChoice");
    removeCls(computerChoice, "thinking");
}

const displayComputerChoice = (value) => {
    let computerChoice = document.getElementById("computerChoice").firstElementChild;
    computerChoice.style.background = "transparent";
    computerChoice.innerHTML = value;
}

const translateElementAgainst = (el, parent) => {
    let elementDistance = el.getBoundingClientRect().x;
    let margin = parseInt(getComputedStyle(el).marginLeft, 10);
    let parentDistance = parent.getBoundingClientRect().x;
    let translateDistance = elementDistance - parentDistance - margin;
    el.style.transform = "translateX(-"+translateDistance+"px)";
}

const returnPosition = (el) => {
    el.style.transform = "none";
}

const showAnnouncement = (result) => {
    let container = document.getElementById("announcement");
    container.innerHTML = result;
    fadeIn(container);
}

const hideComputerChoice = () => {
    let computerChoice = document.getElementById("computerChoice");
    let computerChoiceText = computerChoice.firstElementChild;
    computerChoiceText.style.background = "#ffffff";
    computerChoiceText.innerHTML = "";
    fadeOut(computerChoice);
}

const hideAnnouncement = () => {
    fadeOut(document.getElementById("announcement"));
}

const showRoundOutcome = (resolve, selectedElement, computerValue, result, roundNumber) => {
    delay(0)
    .then(() => fadeOut(document.getElementById("message")))
    .then(() => translateElementAgainst(selectedElement, document.getElementById("choiceList")))
    .then(() => delay(1000))
    .then(() => fadeIn(document.getElementById("computerChoice")))
    .then(() => startThinking())
    .then(() => delay(3000))
    .then(() => stopThinking())
    .then(() => delay(200))
    .then(() => displayComputerChoice(computerValue))
    .then(() => showAnnouncement(result))
    .then(() => colorRoundNumber(roundNumber, result))
    .then(() => delay(2000))
    .then(() => resolve())
    .catch((error) => {
        console.log(error)
    });
}

export {
    addClick,
    removeClick,
    fadeIn,
    fadeOut,
    fadeInOut,
    select,
    deselect,
    selectDeselect,
    returnPosition,
    clearChoiceList,
    fadeInRoundDisplay,
    fadeOutRoundDisplay,
    renderGameOption,
    hideComputerChoice,
    hideAnnouncement,
    resetRoundNumbers,
    showPreGameScreen,
    showGameScreen,
    showRoundOutcome,
    showWinAnimation,
    hideWinAnimation
};