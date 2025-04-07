

let gameState = 'home';
let difficulty = 'easy';
let word = '';
let lives = 7;
let guessedLetters = [];
let correctLetters = [];

//SOUNDS FOR FUNNY
/* const winSound = new Audio('sfx/win.mp3');
winSound.volume = 0.5;
const loseSound = new Audio('sfx/dead.mp3');
loseSound.volume = 0.5;
const wrongSound = new Audio('sfx/bonk.mp3');
wrongSound.volume = 0.6;
const correctSound = new Audio('sfx/right.mp3');
correctSound.volume = 0.3;
const bonkSound = new Audio('sfx/wrong.mp3'); */


// FUNCTION TO CHANGE WHATS ON THE PAGE
async function changeContent(buttonType) {
    if (buttonType === 'easy') {
        gameState = 'playing';
        difficulty = 'easy';
        word = await randomWord(difficulty);
        initializeGame();
    }
    else if (buttonType === 'medium') {
        gameState = 'playing';
        difficulty = 'medium';
        word =  await randomWord(difficulty);
        initializeGame();
    }
    else if (buttonType === 'hard') {
        gameState = 'playing';
        difficulty = 'hard';
        word = await randomWord(difficulty);
        initializeGame();
    }

    else if( buttonType === 'description') {
        gameState = 'description';
    }
    else if (gameState === 'gameOver' || gameState === 'win') {
        gameState = 'home';
    }
    else if (buttonType === 'home') {
        gameState = 'home';
    }

    console.log(word);
    updateContent();
}

window.changeContent = changeContent;

// UPDATE HTML ON SCREEN
function updateContent() {
    const contentDiv = document.querySelector('.app');
    contentDiv.innerHTML = '';

    if (gameState === 'home') {
        contentDiv.innerHTML = `
            <h1 class="welcome">Welcome to WordGuess!</h1>
            <p>Learn how to play with the description button,
                or choose a difficulty level to start playing right away!
            </p>
            <div class="play-buttons">
                <button onClick="changeContent('easy')" class="play-button" id="easy">Easy (4-5 letters)</button>
                <button onClick="changeContent('medium')" class="play-button" id="medium">Medium (6-7 letters)</button>
                <button onClick="changeContent('hard')" class="play-button" id="hard">Hard (8-9 letters)</button>
            </div>

            <div class="description-button-container">
                <button onClick="changeContent('description')" class="description-button">Description</button>
            </div>`
    }

    else if (gameState === 'playing') {
        contentDiv.innerHTML = `   
            <div class="game">
                <h1 class="game-difficulty">${difficulty} mode</h1>
                <div class="letter-box-container">
                    ${renderGame(difficulty)}
                </div>
                <div class="letter-enter">
                    <p>Guess a letter:</p>
                    <input type="text" id="letter-input" maxlength="1" class="letter-input" onkeydown="checkEnter(event)" autofocus>
                    <button onClick="submitInput()" class="letter-button">Submit</button>
                </div>
                <div class="guessed-letters-container">
                    <p>Guessed letters: ${guessedLetters}</p>
                    <div class="guessed-letters"></div>
                </div>
                <div class="lives-container">
                    <p>Lives left: ${lives}</p>
                </div>
                <div class="game-over-container"></div>
                    <button onClick="changeContent('home')" class="back-button">Back</button>
                </div>
            </div>`
    
    }

    if (gameState === 'win') {
        contentDiv.innerHTML = `
            <div class="game-over-text">
                <h1>You win!</h1>
                <p>The word was: ${word}</p>
                <div class="win-back-button-container">
                    <button onClick="changeContent('home')" class="back-button">Play Again</button>
                </div>
            </div>`
    }

    if (gameState === 'gameOver') {
        contentDiv.innerHTML = `
            <div class="game-over-text">
                <h1>Game Over!</h1>
                <p>Good try buddy, but you simply could not use the english lexicon correctly!!</p>
                <p>The word was: ${word}</p>
                <div class="lose-back-button-container">
                    <button onClick="changeContent('home')" class="lose-back-button">Play Again</button>
                </div>
            </div>`
    }

    if (gameState === 'description') {
        contentDiv.innerHTML = `
            <div class="description">
                <h1>How to play</h1>
                <div class="description-text">
                    <p>WordGuess is a word guessing game that selects a random english
                        word.</p>
                    <p>- Guess the word by entering letters. You have 7 tries to guess the word correctly.</p>
                    <p>- After each successful guess, the letter will appear where it is in the word. </p>
                    <p>- After each unsuccessful guess, you will lose a life. </p>
                    <p>- Every time you guess a letter, it will appear in the list of guessed letters.</p>
                    <p>- If you successfully guess all of the letters in the word, you win!</p>
                    <p>- If you run out of lives, you lose!</p>
                    <p>Good luck!</p>
                </div>
                <div class="back-button-container">
                    <button onClick="changeContent('home')" class="back-button" id="back">Back</button>
                </div>
            </div>`
    }

    // MAKE THE CURSER ALWAYS FOCUSED
    const inputElement = document.getElementById('letter-input');
    if (inputElement) {
        inputElement.focus();
    }
}

// TO RESET THE GAME
function initializeGame() {
    correctLetters = [];
    for (let i = 0; i < word.length; i++) {
        correctLetters.push('');
    }
    guessedLetters = [];
    lives = 7;
}

// RENDER THE BOARD EVERYTIME A LETTER IS GUESSED
function renderGame(difficulty) {
    let board = [];
    for (let i = 0; i < word.length; i++) {
        board.push('');
    }
    let boardHTML = '';
    for (let i = 0; i < word.length; i++) {
        boardHTML += `<div class="letter-box">${correctLetters[i]}</div>`;
    }
    return boardHTML;
}

// CALLED WHEN LETTER IS GUESSED
function guessLetter(letter) {
    let correctGuess = false;

    if (guessedLetters.empty) {
        guessedLetters.push(letter);
    }
    else if (guessedLetters.includes(letter)) {
        //bonkSound.play();
        alert('Letter was already guessed');
        return;
    }
    else if (!guessedLetters.includes(letter)) {
        guessedLetters.push(letter);
    }

    for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
            correctLetters[i] = letter;
            correctGuess = true;
        }
    }

    if (correctGuess) {
        //correctSound.play();
    }

    if (!correctGuess) {
        if (lives > 1) {
            //wrongSound.play();
        }
        lives--;
    }
    if (lives === 0) {
        //loseSound.play();
        gameState = 'gameOver';
        updateContent();
    }

}

function checkGameOver() {
    for (let i = 0; i < word.length; i++) {
        if (correctLetters[i] !== word[i]) {
            return;
        }
    }

    //winSound.play();
    gameState = 'win';
    updateContent();   
}





function submitInput() {
    const inputElement = document.getElementById('letter-input');
    const inputValue = inputElement.value;

    if (/^[a-z]$/.test(inputValue)) {
        guessLetter(inputValue);
        updateContent();
        checkGameOver();

    }
    else {
        alert('Enter a single undercase letter')
    }
    inputElement.value = '';
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        submitInput();
    }
}

window.checkEnter = checkEnter;
window.submitInput = submitInput;  

async function randomWord(difficulty) {
    let word = '';
    if (difficulty === 'easy') {
        const easyNumber = Math.floor(Math.random() * 2) + 4; // 4-5 letters
        const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${easyNumber}`);
        const data = await response.json();
        word = data[0];
    }
    else if (difficulty === 'medium') {
        const mediumNumber = Math.floor(Math.random() * 2) + 6; // 6-7 letters
        const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${mediumNumber}`);
        const data = await response.json();
        word = data[0];
    }

    else if (difficulty === 'hard') {
        const hardNumber = Math.floor(Math.random() * 2) + 8; // 8-9 letters
        const response = await fetch(`https://random-word-api.vercel.app/api?words=1&length=${hardNumber}`);
        const data = await response.json();
        word = data[0];
    }

    return word;
}
