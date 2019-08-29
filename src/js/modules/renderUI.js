
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

const clearDOM = (el) => {
    el.innerHTML = "";
}

const showPreGameScreen = () => {
    let game = document.getElementById("game");
    let preGame = document.getElementById("preGame");
    let mainContainer = document.getElementById("gameContainer");
    mainContainer.style.minHeight = preGame.clientHeight.toString()+"px";
    hide(game);
    preGame.style.display = "flex";
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

let timeoutIterator = 0;

let timeoutArr = [
    function(){fadeInOut(document.getElementById("roundContainer"))},
    function(){fadeInOut(document.getElementById("roundText"))}, 
    function(){fadeInOut(document.getElementById("roundText"))}, 
    function(){fadeInOut(document.getElementById("roundContainer"))}
];

const setTimeoutChain = () => {
    timeoutArr[timeoutIterator]();
    timeoutIterator++;

    if(timeoutIterator<timeoutArr.length){
        setTimeout(() => {
            setTimeoutChain();
        }, 800);
    }else{
        timeoutIterator = 0;
    }
}

const displayRound = (round) => {
    let roundNumberEl = document.getElementById("roundNumber");
    roundNumberEl.innerHTML = round;
    setTimeoutChain();
}

const colorRoundNumber = (number, result) => {
    let roundNumbers = [...document.getElementsByClassName("round")];
    roundNumbers[number-1].classList.add(result);
    roundNumbers[number-1].getElementsByTagName("span")[0].innerHTML = result;
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

const startThinking = (el) => {
    addCls(el, "thinking");
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log("started thinking: "+time)
}

const stopThinking = (el) => {
    removeCls(el, "thinking");
}

const displayComputerChoice = (el, value) => {
    el.style.background = "transparent";
    el.innerHTML = value;
}

const translateElementAgainst = (el, parent) => {
    let elementDistance = el.getBoundingClientRect().x;
    let margin = getComputedStyle(el).marginLeft;
    let parentDistance = parent.getBoundingClientRect().x;
    let translateDistance = elementDistance - parentDistance + parseInt(margin, 10);

    el.style.transform = "translateX(-"+translateDistance+"px)";
}

const showComputerChoice = (value) => {
    let computerChoice = document.getElementById("computerChoice")
    computerChoice.style.display = "block";

    fadeIn(computerChoice);

    delay(4000)
    .then(() => startThinking(computerChoice))
    .then(() => delay(2000))
    .then(() => stopThinking(computerChoice))
    .then(() => displayComputerChoice(computerChoice.firstElementChild, value))
    .catch((error) => {
        console.log(error)
    });
}

const hideComputerChoice = () => {
    let computerChoice = document.getElementById("computerChoice")
    console.log("hide computer choice");
    hide(computerChoice)
    fadeOut(computerChoice);
}

const showRoundOutcome = (selectedElement, computerValue) => {
    let startOutcomeShowChain = new Promise((resolve) => {
        translateElementAgainst(selectedElement, document.getElementById("choiceList"));
        resolve(true);
    })
    startOutcomeShowChain
    //.then(() => translateElementAgainst(selectedElement, document.getElementById("choiceList")))
    .then(() => showComputerChoice(computerValue))
    .then(() => hideComputerChoice());
    // translateElementAgainst(selectedElement, document.getElementById("choiceList"));
    // showComputerChoice(computerValue);
    // setTimeout(hideComputerChoice(), 10000);
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
    clearDOM,
    colorRoundNumber,
    displayRound,
    renderGameOption,
    showPreGameScreen,
    showGameScreen,
    showRoundOutcome,
    showWinAnimation,
    hideWinAnimation
};