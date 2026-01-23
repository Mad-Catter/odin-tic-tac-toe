// Function that starts the game to keep everything out of global (possible iife)
// An object that contains a 3x3 array of the board and methods to change the board.
// One method take a players mark and location on the board, changes the board, and then console logs the board.
// This calls another method which takes a mark and sees if the current mark equals any possible victory conditions.
//   If so, it will list a winner and end the game.  If all spaces are filled, it will state a tie (possibly introduce logic for realizing a game is unwinnable)
// Needs a player factory.  The factory takes a mark (x or o).
// Player objects have access to the method to change the board, but not see the board outside of the change.  This method should only take a tile number.
// 

function startGame() {
    console.log("Starting a new game!")
    const boardObject = (function () {
        const boardArray = [
            "", "", "",
            "", "", "",
            "", "", ""
        ];
        const listOfVictories = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [3, 4, 5], [2, 5, 8], [6, 7, 8], [2, 4, 6]];
        const staticListOfVictories = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [3, 4, 5], [2, 5, 8], [6, 7, 8], [2, 4, 6]];
        
        let lastPlayed = ""
        const victory = (mark) => {
            console.log(`Player ${mark} has won!`);
            boardClear();
            return `${mark}victory`;
        }
        function boardClear() {
            console.log("Resetting Game");
            for (let i = 0; i < boardArray.length; i++) {
                boardArray[i] = "";
            }
            lastPlayed = "";
            listOfVictories.splice(0,listOfVictories.length);
            for (const item of staticListOfVictories) {
                listOfVictories.push(item);
            }
        }

        const checkVictory = (mark) => {
            for (let i = listOfVictories.length -1; i >= 0; i--) {
                const item = listOfVictories[i];
                const array = [boardArray[item[0]],boardArray[item[1]],boardArray[item[2]]];
                if (array.includes("O") && array.includes("X")) {
                    listOfVictories.splice(listOfVictories.indexOf(item), 1)
                } else if (!(array.includes(""))) {
                    return victory(mark);
                }
            }
            
            if (listOfVictories.length === 0) {
                console.log("Its a tie! All tiles are filled!")
                boardClear();
                return "tie"
            } else {
                return "";
            }
        }

        const changePosition = (mark, position) => {
            if (lastPlayed === mark) {
                console.log(`Player ${mark} just played! You can't take two turns in a row, thats cheating!`)
                return "doublePlay";
            } else if (boardArray[position] !== "") {
                console.log("That position is taken! Choose another one!")
                return "positionTaken";
            } else {
                boardArray[position] = mark;
                console.log(boardArray);
                lastPlayed = mark;
                return checkVictory(mark);
            }
        }
        return {changePosition}
    })()
    function playerFactory(mark) {
        const playerMark = mark;
        const changePosition = (position) => boardObject.changePosition(playerMark, position);
        return {changePosition}
    }
    const playerX = playerFactory("X");
    const playerO = playerFactory("O");

    return {turnX: playerX.changePosition, turnO: playerO.changePosition}
}
// Need to decide which side goes first.
//Depending on choice, a variable deciding whos turn it is is set to either x or o
// Each tile has an event listener that will trigger player X/O placement depending on the turn variable and will switch the turn variable.
// The text content of that tile's text content will be set to x or o.
// A new game gets called each time the game concludes.  A running tally of x vs o will be increased.

(function() {
    let currentTurn;
    let tallyO = 0;
    let tallyX = 0;
    const domScoreO = document.querySelector(".score-o");
    const domScoreX = document.querySelector(".score-x");
    const playerNameO = document.querySelector("#player-o")
    const playerNameX = document.querySelector("#player-x")
    const info = document.querySelector(".information");
    const endScreen = document.querySelector(".end-screen");
    const body = document.querySelector("body");
    
    const modal = document.querySelector(".button-screen");
    modal.showModal();
    const buttons = document.querySelectorAll(".button-container button");
    for (const button of buttons) {
        button.addEventListener("click", e => {
            modal.close();
            if (button.classList.contains("o-first")) {
                currentTurn = "O";
            } else {
                currentTurn = "X";
            }
            
        })
    }
    let game = startGame();
    const tiles = document.querySelectorAll(".tile");
    for (const tile of tiles) {
        tile.addEventListener("click", e => {
            tileNum = tile.classList.value.replace("tile square", "")
            if (currentTurn === "O") {
                let action = game.turnO(tileNum);
                if (action === "") {
                    tile.textContent = "O";
                    currentTurn = "X";
                } else if (action === "Ovictory") {
                    e.stopPropagation();
                    endScreen.textContent = `${playerNameO.value} has won!`;
                    endScreen.show();
                    tallyO++;
                    resetBoard();
                } else if (action === "tie") {
                    e.stopPropagation();
                    endScreen.textContent ="Its a tie!";
                    endScreen.show();
                    resetBoard();
                }else {
                    e.stopPropagation();
                    info.textContent = "That tile is already taken!  Choose another one!";
                    info.show();
                }
            } else {
                let action = game.turnX(tileNum);
                if (action === "") {
                    tile.textContent = "X";
                    currentTurn = "O";
                } else if (action === "Xvictory") {
                    e.stopPropagation();
                    endScreen.textContent = `${playerNameX.value} has won!`;
                    endScreen.show();
                    tallyX++;
                    resetBoard();
                } else if (action === "tie") {
                    e.stopPropagation();
                    endScreen.textContent ="Its a tie!";
                    endScreen.show();
                    resetBoard();
                }else {
                    e.stopPropagation();
                    info.textContent = "That tile is already taken!  Choose another one!";
                    info.show();
                }
            }
        })
    }
    function resetBoard() {
        for (const tile of tiles) {
            tile.textContent = "";
        }
        domScoreO.textContent = tallyO;
        domScoreX.textContent = tallyX;
        game = startGame();
        modal.showModal()
    }
    const resetButton = document.querySelector(".reset");
    resetButton.addEventListener("click", e => {
        resetBoard();
    })
    body.addEventListener("click", e => {
        info.close();
        endScreen.close();
    })
})();



// Needs to check if a victory is possible, needs to check if a victory has occured, and needs to make sure that all possible victories are not ruled out
// The function cant cancel the game early.
// Function 1. Has an object with a list of possible victories.  Each value is an array.
// Have a function that checks if the value is true or not.  If it is not false, it destructures each value in the array and checks to see if is 
// The function checks each value to see if it contains both X and O, if it does the value is then set to false.
//  If it does not contain both, it checks for a victory.
