// The goal of this project is to practice keeping as much code out of the global scope as possible with IIFE's and factory functions.

function startGame() {
    console.log("Starting a new game!")
    const boardObject = (function () {
        const boardArray = [
            "", "", "",
            "", "", "",
            "", "", ""
        ];
        const listOfVictories = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [3, 4, 5], [2, 5, 8], [6, 7, 8], [2, 4, 6]];
        // lastPlayed can be removed for the dom only version, but it is kept for console play.
        let lastPlayed = ""

        const victory = (mark) => {
            console.log(`Player ${mark} has won!`);
            console.log("Run a new game to play again!")
            return `${mark}victory`;
        }

        // checkVictory iterates through every possible combination of tiles that can lead to a victory.
        //Since no winning line can have both player's marks, if both player's have a mark on a line it will be removed from a list of possible victories for performance.
        //If a line does not include both marks and includes no empty spaces, we give the victory to the current player since you can never lose on your own turn.
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
            // If no possible victories remain the game is called in a tie.
            if (listOfVictories.length === 0) {
                console.log("Its a tie! All tiles are filled!")
                return "tie"
            } else {
                return "";
            }
        }

        const changePosition = (mark, position) => {
            // Once again this first error message is only for console play.
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
    const buttons = document.querySelectorAll(".button-container button");
    const modal = document.querySelector(".button-screen");
    modal.showModal();
    // Since there are only two options of O or X in most choices, O is checked first and then it is assumed if the answer is not O, it must be X.
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
            // An empty action is means that nothing special is occuring (an error or victory), and the game should continue on as normal.
            let action;
            if (currentTurn === "O") {
                action = game.turnO(tileNum);
            } else {
                action = game.turnX(tileNum);
            }
            if (action === "") {
                if (currentTurn === "O") {
                    tile.textContent = "O";
                    currentTurn = "X";
                } else {
                    tile.textContent = "X";
                    currentTurn = "O";
                }
            //The stopPropagation()s are so that the dialog popup does not instanty dissapear. I was tempted to put it earlier in the eventlistner instead of repeating 3x
            //However I do want the dialogs to disapear on a valid action, so I kept it like this. 
            } else if (action === "Ovictory" || action === "Xvictory") {
                e.stopPropagation();
                if (action === "Ovictory") {
                    endScreen.textContent = `${playerNameO.value} has won!`;
                    tallyO++;
                } else {
                    endScreen.textContent = `${playerNameX.value} has won!`;
                    tallyX++;
                }
                endScreen.show();
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