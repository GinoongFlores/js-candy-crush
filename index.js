const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
const board = [];
const row = 9;
const columns = 9;
let score = 0;

let currentTile;
let otherTile;

window.onload = function () {
    startGame();
}

function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; // 0 - 5.999
}

function startGame() {
    // 2d Array of 9x9 
    for (let r = 0; r < row; r++) {
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
}

// e.preventDefault() is a function that allows us to drop the candy
function dragOver(e) {
    e.preventDefault(); // allows us to drop the candy
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    // this refers to the tile is being dropped on
    otherTile = this;
}

// this function is where we do the swapping of candies 
function dragEnd() {
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

    // the src is the image of the candy from the tile that is being clicked or dragged 
    let currentImg = currentTile.src;
    let otherImg = otherTile.src;

    // here we swap the current candy by its image source to other candy depending on which candy is being dropped on
    currentTile.src = otherImg;
    otherTile.src = currentImg;
}