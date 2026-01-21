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
    const listOfVictories = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [3, 4, 5], [2, 5, 8], [6, 7, 8], [2, 4, 6]];
    const staticListOfVictories = [[0, 1, 2], [0, 3, 6], [0, 4, 8], [1, 4, 7], [3, 4, 5], [2, 5, 8], [6, 7, 8], [2, 4, 6]];
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
        listOfVictories.splice(0,listOfVictories.length);
        for (const item of staticListOfVictories) {
            listOfVictories.push(item);
        }
    }
    const checkVictory = (mark) => {
        for (const item of listOfVictories) {
            const a = boardArray[item[0]];
            const b = boardArray[item[1]];
            const c = boardArray[item[2]];
            const array = [a,b,c];
            // TODO: This does not work properly. Removing while iterating over the list will potentially screw up the list.
            // Additionally, I want to try to do better on the a b c definitions.  I would like to get that all onto one line if possible.
            // The way I reset the list of victories isnt amazing either.  I could maybe go back to the idea of setting the item to false instead.
            // But I wanted to try to cut down on the amount of iterations instead of just constantly rechecking the same false item.
            // Im sure its not a massive preformance loss or anything, but its something I want to keep in mind.
            if (array.includes("O") && array.includes("X")) {
                listOfVictories.splice(listOfVictories.indexOf(item), 1)
            } else if (!(array.includes(""))) {
                victory(mark);
            }
      }
      if (listOfVictories.length === 0) {
        console.log("Its a tie! All tiles are filled!")
        boardClear();
      }
      console.log(listOfVictories);

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
