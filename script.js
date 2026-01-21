// Function that starts the game to keep everything out of global (possible iife)
// An object that contains a 3x3 array of the board and methods to change the board.
// One method take a players mark and location on the board, changes the board, and then console logs the board.
// This calls another method which takes a mark and sees if the current mark equals any possible victory conditions.
//   If so, it will list a winner and end the game.  If all spaces are filled, it will state a tie (possibly introduce logic for realizing a game is unwinnable)
// Needs a player factory.  The factory takes a mark (x or o).
// Player objects have access to the method to change the board, but not see the board outside of the change.  This method should only take a tile number.
// 

// function startGame() {
const boardObject = (function () {
    const boardArray = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];
    let lastPlayed = ""
    const victory = (mark) => {
        console.log(`Player ${mark} has won!`);
        boardClear();
    }
    function boardClear() {
        console.log("Resetting Game");
        for (let i = 0; i < boardArray.length; i++) {
            boardArray[i] = "";
        }
        lastPlayed = "";
    }
    const checkVictory = (mark) => {
        if(!boardArray.includes("")) {
            console.log("Its a tie! All tiles are filled!")
            boardClear();
        } else if (boardArray[0] === mark) {
            if ((boardArray[1] === mark) && (boardArray[2] === mark)) {
                victory(mark);
            } else if ((boardArray[3] === mark) && (boardArray[6] === mark)) {
                victory(mark);
            } else if ((boardArray[4] === mark) && (boardArray[8] === mark)) {
                victory(mark);
            }
        } else if (boardArray[4] === mark) {
            if ((boardArray[1] === mark) && (boardArray[7] === mark)) {
                victory(mark);
            } else if ((boardArray[3] === mark) && (boardArray[5] === mark)) {
                victory(mark);
            } else if ((boardArray[2] === mark) && (boardArray[6] === mark)) {
                victory(mark);
            }
        } else if (boardArray[8] === mark) {
            if ((boardArray[2] === mark) && (boardArray[5] === mark)) {
                victory(mark);
            } else if ((boardArray[6] === mark) && (boardArray[7] === mark)) {
                victory(mark);
            }
        } 
    }
    const changePosition = (mark, position) => {
        if (lastPlayed === mark) {
            console.log(`Player ${mark} just played! You can't take two turns in a row, thats cheating!`)
        } else if (boardArray[position] !== "") {
            console.log("That position is taken! Choose another one!")
        } else {
            boardArray[position] = mark;
            console.log(boardArray);
            lastPlayed = mark;
            checkVictory(mark);
            
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

// }

// Needs to check if a victory is possible, needs to check if a victory has occured, and needs to make sure that all possible victories are not ruled out
// The function cant cancel the game early.
// Function 1. Has an object with a list of possible victories.  Each value is an array.
// Have a function that checks if the value is true or not.  If it is not false, it destructures each value in the array and checks to see if is 
// The function checks each value to see if it contains both X and O, if it does the value is then set to false.
//  If it does not contain both, it checks for a victory.

// const listOfVictories = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [3, 4, 5], [2, 5, 8], [6, 7, 8], [2, 4, 6]];
// for item in listOfVictories {
//     if (item) {
//          let {item[0]:a item[2]:b item[3]:c} = boardArray;
//          const array = [a,b,c]
//          if (array.includes("O") && array.includes("X")) {
//            item = false;
//          } else if (!(array.includes(""))) {
//              victory
//          }
//      }
// }
// if (listofVictories.some(Boolean)) {
//  tie
// }