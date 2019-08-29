
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

const fadeIn = (el) => {
    el.style.opacity = "1";
}

const fadeOut = (el) => {
    el.style.opacity = "0";
}

const select = (el) => {
    el.classList.add("selected");
}

const deselect = (el) => {
    el.classList.remove("selected");
}

const removeClick = (el) => {
    el.style.pointerEvents = "none";
}

const addClick = (el) => {
    el.style.pointerEvents = "all";
}

const clearDOM = (el) => {
    el.innerHTML = "";
}

const showPreGameScreen = () => {
    let game = document.getElementById("game");
    let preGame = document.getElementById("preGame");
    let mainContainer = document.getElementById("gameContainer");
    mainContainer.style.minHeight = preGame.clientHeight.toString()+"px";
    game.style.display = "none";
    preGame.style.display = "flex";
}

const showGameScreen = () => {
    let game = document.getElementById("game");
    let preGame = document.getElementById("preGame");
    game.style.display = "flex";
    preGame.style.display = "none";
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
    document.getElementById("winHeader").style.display = "none";
    let winAnimation = document.getElementById("winAnimationContainer");
    fadeOut(winAnimation);
    removeClick(winAnimation);
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
    showWinAnimation,
    hideWinAnimation
};