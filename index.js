const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
const board = [];
const rows = 9;
const columns = 9;
let score = 0;

let currentTile;
let otherTile;
const audioElement = new Audio("./audio/candy-crush-sound-effect.mp3");

audioElement.loop = true;
audioElement.volume = 0.3;

window.onload = function () {
    startGame();
    audioElement.play();

    window.setInterval(function () {
        crushCandy(); // crush candies in 3 x 3 move 
        slideCandy(); // slide candies down
        generateCandy(); // generate new candies
    }, 100)
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; // 0 - 5.999
}

function startGame() {
    // 2d Array of 9x9 
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // <img id="0-0" src="./images/image.png"> 
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            // Drags and Drops events
            tile.addEventListener("dragstart", dragStart); // click on a candy, initialize drag process
            tile.addEventListener("dragover", dragOver); // clicking on a candy, moving mouse to drag the candy
            tile.addEventListener("dragenter", dragEnter); // dragging candy into another candy
            tile.addEventListener("dragleave", dragLeave); // leave a candy over another candy
            tile.addEventListener("drop", dragDrop); // dropping a candy over another candy 
            tile.addEventListener("dragend", dragEnd); // after dropping a candy, then we swap candies

            document.getElementById("board").appendChild(tile);
            row.push(tile); // adds each tile to the row []
        }
        board.push(row);
    }
    // console.log(board);
}

function dragStart() {
    // this refers to the tile is being clicked or dragged
    currentTile = this;
    audioElement.pause();
}

// e.preventDefault() is a function that allows us to drop the candy
function dragOver(e) {
    e.preventDefault(); // allows us to drop the candy
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {
    // this refers to the tile is being dropped on
    otherTile = this;
}

function dragDrop() {
    // this refers to the tile is being dropped on
    otherTile = this;
}

// this function is where we do the swapping of candies 
function dragEnd() {
    // check if the tile is blank or not to prevent swapping with blank tiles
    if (currentTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    // here we swap the images sources of the two tiles (currentTile & otherTile)
    // split the id of the tile to get the row and column
    let currentCoordinates = currentTile.id.split("-"); // id="0-0" => ["0", "0"] as we split the split the "-" on the array
    let currentRow = parseInt(currentCoordinates[0]);
    let currentColumn = parseInt(currentCoordinates[1]);

    let otherCoordinates = otherTile.id.split("-");
    let otherRow = parseInt(otherCoordinates[0]);
    let otherColumn = parseInt(otherCoordinates[1]);

    // check if the candy is adjacent to the other candy
    let moveLeft = otherColumn == currentColumn - 1 && currentRow == otherRow;
    let moveRight = otherColumn == currentColumn + 1 && currentRow == otherRow;

    let moveUp = otherRow == currentRow - 1 && currentColumn == otherColumn;
    let moveDown = otherRow == currentRow + 1 && currentColumn == otherColumn;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;
    if (isAdjacent) {
        // the src is the image of the candy from the tile that is being clicked or dragged 
        let currentImg = currentTile.src;
        let otherImg = otherTile.src;

        // here we swap the current candy by its image source to other candy depending on which candy is being dropped on
        currentTile.src = otherImg;
        otherTile.src = currentImg;

        // check to crush candies in 3 x 3 move
        let validMove = checkValid();
        if (!validMove) {
            let currentImg = currentTile.src;
            let otherImg = otherTile.src;
            currentTile.src = otherImg;
            otherTile.src = currentImg;
        }
    }

}

function crushCandy() {
    //crushFive()
    //crushFour()

    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree() {
    // check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];

            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png"
                candy2.src = "./images/blank.png"
                candy3.src = "./images/blank.png"
                score += 3;
            }
        }
    }

    // check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];

            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                candy1.src = "./images/blank.png"
                candy2.src = "./images/blank.png"
                candy3.src = "./images/blank.png"
                score += 3;
                audioElement.play();
            }
        }
    }

}

function checkValid() {
    // check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c + 1];
            let candy3 = board[r][c + 2];

            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                return true; // return true to remain the candies in the board 
            }
        }
    }

    // check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r + 1][c];
            let candy3 = board[r + 2][c];

            if (candy1.src === candy2.src && candy2.src === candy3.src && !candy1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false; // return false if we didn't find any valid combination 
}

function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let index = rows - 1; // start from the bottom row    
        for (let r = columns - 1; r >= 0; r--) { // moves up 
            if (!board[r][c].src.includes("blank")) { // check if the candy is not blank
                board[index][c].src = board[r][c].src; // set the current blank tile to the candy that is not blank
                // index--;
                index -= 1; // move the blank tile up by 1
            }
        }

        for (let r = index; r >= 0; r--) {
            board[r][c].src = "./images/blank.png"; // set the current blank tile to blank image for the rest of the tiles
        }
    }
}

function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) { // check if the row is blank to generate a new candy 
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}