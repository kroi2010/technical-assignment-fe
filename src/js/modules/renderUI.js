/**
 * 
 * @param {number} time - time for delay in between functions in ms
 * @returns {Promise} - returns a promise for setTimeout function
 */
const delay =  ((time) => { 
    return new Promise((resolve) => {
        return setTimeout(function(){
            resolve(true);
        }, time);  
    });
});

/**
 * 
 * @param {object} option - Weapon object 
 * @param {object} parrent - HTML DOM element object
 * @returns {object} - HTML DOM element object of Weapon
 */
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

/**
 * 
 * @param {object} el - HTML DOM element object
 * @param {string} cls - class value that needs to be added
 */
const addCls = (el, cls) => {
    el.classList.add(cls);
}

/**
 * 
 * @param {object} el - HTML DOM element object
 * @param {string} cls - class value that needs to be removed
 */
const removeCls = (el, cls) => {
    el.classList.remove(cls);
}

/**
 * Sets opacity of element to 1
 * @param {object} el - HTML DOM element object
 */
const fadeIn = (el) => {
    el.style.opacity = "1";
}

/**
 * Sets opacity of element to 0
 * @param {object} el - HTML DOM element object
 */
const fadeOut = (el) => {
    el.style.opacity = "0";
}

/**
 * Adds 'selected' class to element
 * @param {object} el - HTML DOM element object
 */
const select = (el) => {
    addCls(el, "selected")
}

/**
 * Removes 'selected' class from element
 * @param {object} el - HTML DOM element object
 */
const deselect = (el) => {
    removeCls(el, "selected");
}

/**
 * Adds 'no pointer' events styling to element
 * @param {object} el - HTML DOM element object
 */
const removeClick = (el) => {
    el.style.pointerEvents = "none";
}

/**
 * Removes 'no pointer' events styling from element
 * @param {object} el - HTML DOM element object
 */
const addClick = (el) => {
    el.style.pointerEvents = "all";
}

/**
 * Sets display style of element to none
 * @param {object} el - HTML DOM element object
 */
const hide = (el) => {
    el.style.display = "none";
}

/**
 * Removes all weapon choices from the DOM from previous game
 */
const clearChoiceList = () => {
    [...document.getElementById("choiceList")
    .getElementsByClassName("choice")]
    .filter(choice => choice.id!=="computerChoice")
    .map(choice => choice.remove());
}

/**
 * Renders pre game screen
 */
const showPreGameScreen = () => {
    let game = document.getElementById("game");
    let preGame = document.getElementById("preGame");
    let mainContainer = document.getElementById("gameContainer");
    hide(game);
    preGame.style.display = "flex";
    mainContainer.style.minHeight = preGame.clientHeight.toString()+"px";
}

/**
 * Renders game screen
 */
const showGameScreen = () => {
    let game = document.getElementById("game");
    let preGame = document.getElementById("preGame");
    game.style.display = "flex";
    hide(preGame);
}

/**
 * Toggles class for element depending on opacity
 * @param {object} el - HTML DOM element object
 */
const fadeInOut = (el) => {
    if(getComputedStyle(el).opacity=="0"){
        fadeIn(el);
    }else{
        fadeOut(el);
    }
}

/**
 * Toggles class for element depending on 'selected' class
 * @param {object} el - HTML DOM element object
 */
const selectDeselect = (el) => {
    if(el.classList.contains("selected")){
        deselect(el);
    }else{
        select(el);
    }
}

/**
 * First part of round animation
 * Fades in screen with next round number on it
 * @param {*} resolve 
 * @param {number} round - number that describes upcomming round count
 */
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

/**
 * Second part of round animation
 * Fades out next round screen 
 * @param {*} resolve 
 */
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

/**
 * Adds class to round number in header depending on outcome of last match
 * Adds label underneath round number displaying result of that match
 * @param {number} number - represent round number
 * @param {string} result - possible values: 'won', 'lost', 'tie'
 */
const colorRoundNumber = (number, result) => {
    let roundNumbers = [...document.getElementsByClassName("round")];
    roundNumbers[number-1].classList.add(result);
    roundNumbers[number-1].getElementsByTagName("span")[0].innerHTML = result;
}

/**
 * Resets round number list header to it's initial state
 * Gets rid of extra classes
 * Clears round labels
 */
const resetRoundNumbers = () => {
    let roundNumbers = [...document.getElementsByClassName("round")];
    for(let i=0; i<roundNumbers.length; i++){
        let statusClass = [...roundNumbers[i].classList].find(cls => cls!=="round");
        roundNumbers[i].classList.remove(statusClass);
        roundNumbers[i].firstElementChild.innerHTML = "";
    }
}

/**
 * Shows win animation in the end of each game
 * Depending if header is provided, displays header tag with message
 * @param {string} header - string message for header
 * @param {string} msg - string message for win animation body
 */
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

/**
 * Hides win animation from user
 */
const hideWinAnimation = () => {
    hide(document.getElementById("winHeader"));
    let winAnimation = document.getElementById("winAnimationContainer");
    fadeOut(winAnimation);
    removeClick(winAnimation);
}

/**
 * Adds 'thinking' class to computers weapon choice
 * It starts waiting animation, which is supposed to bring more tension into the game 
 */
const startThinking = () => {
    let computerChoice = document.getElementById("computerChoice")
    addCls(computerChoice, "thinking");
}

/**
 * Removes 'thinking' class from computers weapon choice
 * It finishes animation in preparation to weapon name display
 */
const stopThinking = () => {
    let computerChoice = document.getElementById("computerChoice");
    removeCls(computerChoice, "thinking");
}

/**
 * Displays name of the weapon
 * @param {string} value - name of the weapon that was picked by computer
 */
const displayComputerChoice = (value) => {
    let computerChoice = document.getElementById("computerChoice").firstElementChild;
    computerChoice.style.background = "transparent";
    computerChoice.innerHTML = value;
}

/**
 * Calculates distance for transform: translate styling, to move users choice to the side of the screen
 * @param {object} el - HTML DOM element object, that needs to be translated
 * @param {object} parent - HTML DOM element object, that will be used to translate our main element against
 */
const translateElementAgainst = (el, parent) => {
    let elementDistance = el.getBoundingClientRect().x;
    let margin = parseInt(getComputedStyle(el).marginLeft, 10);
    let parentDistance = parent.getBoundingClientRect().x;
    let translateDistance = elementDistance - parentDistance - margin;
    el.style.transform = "translateX(-"+translateDistance+"px)";
}

/**
 * Returns back element to it's original position
 * @param {object} el - HTML DOM element object, that was previously translated
 */
const returnPosition = (el) => {
    el.style.transform = "none";
}

/**
 * Displays match result between two rival weapon choices for user to easily see.
 * @param {string} result - string, possible values are: 'won', 'lost', 'tie'
 */
const showAnnouncement = (result) => {
    let container = document.getElementById("announcement");
    container.innerHTML = result;
    fadeIn(container);
}

/**
 * Hides computer weapon choice and provides more space for weapon choices to display
 */
const hideComputerChoice = () => {
    let computerChoice = document.getElementById("computerChoice");
    let computerChoiceText = computerChoice.firstElementChild;
    computerChoiceText.style.background = "#ffffff";
    computerChoiceText.innerHTML = "";
    fadeOut(computerChoice);
}

/**
 * Hides match result
 */
const hideAnnouncement = () => {
    fadeOut(document.getElementById("announcement"));
}

/**
 * Chain of functions for displaying major UI changes during match
 * @param {*} resolve 
 * @param {object} selectedElement - HTML DOM element object, repreenting user weapon choice
 * @param {string} computerValue - string, name of a weapon choice picked by computer
 * @param {string} result - match outcome, possible values are: 'won', 'lost', 'tie'
 * @param {number} roundNumber - number representing just finished round 
 */
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