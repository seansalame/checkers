
let numRedAcquired = 0;    // number of pieces acquired by red
let numWhiteAcquired = 0;  // number of pieces acquired by white
const redHTML = '<img ondragstart="onDragStart(event)" ondragend="onDragEnd(event)" ondragenter="onDragEnter(event)" ondragleave="onDragLeave(event)" class="red" draggable="true" src="img/red-piece.png">';
const whiteHTML = '<img ondragstart="onDragStart(event)" ondragend="onDragEnd(event)" ondragenter="onDragEnter(event)" ondragleave="onDragLeave(event)" class="white" draggable="true" src="img/white-piece.png">';
const whiteKingHTML = '<img ondragstart="onDragStart(event)" ondragend="onDragEnd(event)" ondragenter="onDragEnter(event)" ondragleave="onDragLeave(event)" class="kingWhite" draggable="true" src="img/white-king-piece.png">';
const redKingHTML = '<img ondragstart="onDragStart(event)" ondragend="onDragEnd(event)" ondragenter="onDragEnter(event)" ondragleave="onDragLeave(event)" class="kingRed" draggable="true" src="img/red-king-piece.png">';

var dragged;
let killPiece;
let board = [["white","white","white","white"], ["white","white","white","white"], ["white","white","white","white"], ["","","",""], ["","","",""], ["red","red","red","red"], ["red","red","red","red"], ["red","red","red","red"]];
let startingId = null;
let startingX, finalX;
let startingY, finalY;
let currentPlayer, previousPlayer;
let kingPiece;
let firstTurn = true;
let ableToMove, kill, dragWorked;
let registerWinner = false;

// Cache Elements from HTML to JS
let activeCellsEl = document.querySelectorAll(".active-cell");
let redScoreEl = document.getElementById("red-score");
let whiteScoreEl = document.getElementById("white-score");
let currentTurnEl = document.getElementById("current-turn");

// Add Event Listeners
resetBtnEl.addEventListener("mouseover", mouseOverReset);
resetBtnEl.addEventListener("mouseout", returnResetButton);
for (i=0; i < 32; i++){
  activeCellsEl[i].addEventListener("dragstart", onDragStart);
  activeCellsEl[i].addEventListener("dragend", onDragEnd);
  activeCellsEl[i].addEventListener("dragover", onDragOver);
  activeCellsEl[i].addEventListener("dragenter", onDragEnter);
  activeCellsEl[i].addEventListener("dragleave", onDragLeave);
  activeCellsEl[i].addEventListener("drop", onDrop);
}
 // Update the score
function updateScore(red, white){
    numRedAcquired += red;
    numWhiteAcquired += white;
    redScoreEl.innerHTML = "OFER: " + numRedAcquired;
    whiteScoreEl.innerHTML = "IDAN: " + numWhiteAcquired;
};
 // Who is the king by cell ID
function kingsRow(event) {
  if (["00", "01", "02", "03"].includes(event.target.id)){
    document.getElementById(event.target.id).innerHTML = redKingHTML;
    kingPiece = true;
  } else if (["70", "71", "72", "73"].includes(event.target.id)){
    document.getElementById(event.target.id).innerHTML = whiteKingHTML;
    kingPiece = true;
  } else {  
    kingPiece = false;
  }
}
 // who is the winner
function checkAndAnnounceWinner(){
  let countWhite = 0;
  let countRed = 0;
  for (let j = 0; j < 4; j++){
    for (let i = 0; i < 8; i++){
      if (board[i][j] === "white" || board[i][j] === "kingWhite"){
        countRed += 1;
      } else if (board[i][j] === "red" || board[i][j] === "kingRed"){
        countWhite += 1;
      }
    }
  }

  if (countWhite === 0) {
    registerWinner = true;
    currentTurnEl.innerHTML = "IDAN WINS!";
    } else if (countRed === 0) {
    registerWinner = true;
    currentTurnEl.innerHTML = "OFER WINS!";
    
  }
};

function even(number){
  if(number % 2 == 0) {
    return true;
  }
}

// dragging 
function onDragStart(event){
  dragged = event.target;
  currentPlayer = dragged.className;
  if (currentPlayer !== previousPlayer && dragged.parentNode.className !== "cell"){
    dragWorked = true;
    startingId = dragged.parentNode.id;
    ableToMove = true;
    kill = true;
    board[parseInt(startingId[0])][parseInt(startingId[1])] = "";
    event.target.style.opacity = .5;
    startingX = event.clientX;
    startingY = event.clientY;
  } else if (currentPlayer === previousPlayer){
    event.preventDefault(); // prevents player from repeating
  }
  else {
    dragWorked = false;
    currentPlayer = previousPlayer;
  }
}

function onDragEnd(event){
  event.preventDefault();
  event.target.style.opacity = "";
}

function onDragOver(event){
  event.preventDefault(); 
}

function onDragEnter(event){
  if (event.target.className == "active-cell") {
    event.target.style.background = "black";
  }
}

function onDragLeave(event){
  if (event.target.className == "active-cell") {
    event.target.style.background = "";
  }
}

function onDrop(event) {
  finalX = event.clientX;
  finalY = event.clientY;
  differenceX = finalX - startingX;
  differenceY = startingY - finalY;

  event.preventDefault();
  let dropId = event.target.id;
  let killId = "";
  
// active cells in the board
  if (even(startingId[0])) {
    killId = (Math.round((parseInt(startingId) + parseInt(dropId))/2)).toString();
  } else if (!even(startingId[0])){
    killId = (Math.floor((parseInt(startingId) + parseInt(dropId))/2)).toString();
  }
  if (!["00","01","02","03","10","11","12","13","20","21","22","23","30","31","32","33","40","41","42","43","50","51","52","53","60","61","62","63","70","71","72","73"].includes(killId)) {
    killId = dropId;
  }

  if (Math.abs(parseInt(startingId[0]) - parseInt(dropId[0])) > 2) {
    ableToMove = false;
    kill = false;
  } else if (Math.abs(parseInt(startingId[0]) - parseInt(dropId[0])) == 2 && board[parseInt(dropId[0])][parseInt(dropId[1])] === "" && board[parseInt(killId[0])][parseInt(killId[1])] === dragged.className){
      ableToMove = false;
      kill = false;
  } else if (dragged.className === "red" && differenceY < 0 && !kingPiece) {
      dragWorked = false;
      ableToMove = false;
      kill = false;
  } else if (dragged.className === "white" && differenceY > 0 && !kingPiece) {
      dragWorked = false;
      ableToMove = false;
      kill = false;
  } else if (dragged.className === "kingRed") {
        ableToMove = true;
        kill = true;
  } else if (dragged.className === "kingWhite") {
        ableToMove = true;
        kill = true;
  } else if (Math.abs(parseInt(startingId[0]) - parseInt(dropId[0])) >= 2 && board[parseInt(dropId[0])][parseInt(dropId[1])] === "" && board[parseInt(killId[0])][parseInt(killId[1])] === "") {
      ableToMove = false;
      kill = false;
  } else if (currentPlayer === previousPlayer){
      ableToMove = false;
      kill = false;
  } else if (dragged.className === "white" && firstTurn === true){
      ableToMove = false;
      kill = false;
  } else if (Math.abs(parseInt(startingId[0]) - parseInt(dropId[0])) == 2 && board[parseInt(dropId[0])][parseInt(dropId[1])] === "" && board[parseInt(killId[0])][parseInt(killId[1])] !== dragged.className) {
      ableToMove = true;
      kill = true;
  } else if (Math.abs(parseInt(startingId[0]) - parseInt(dropId[0])) === 1 && board[parseInt(dropId[0])][parseInt(dropId[1])] === "") {
      ableToMove = true;
  } else if (startingId === dropId){
      dragWorked = false;
  }
  if (dragWorked && dragged.className === "white" && board[parseInt(killId[0])][parseInt(killId[1])] === "red" && kill === true && ableToMove === true){
    board[parseInt(killId[0])][parseInt(killId[1])] = "";
    updateScore(0, 1);
    document.getElementById(killId).innerHTML = "";
    kill = false;
  } else if (dragWorked && dragged.className === "red" && board[parseInt(killId[0])][parseInt(killId[1])] === "white" && kill === true && ableToMove === true) {
      board[parseInt(killId[0])][parseInt(killId[1])] = "";
      updateScore(1, 0);
      document.getElementById(killId).innerHTML = "";
      kill = false;
  } else if (dragWorked && dragged.className === "red" && board[parseInt(killId[0])][parseInt(killId[1])] === "white" && kill === true && ableToMove === true) {
      board[parseInt(killId[0])][parseInt(killId[1])] = "";
      updateScore(1, 0);
      document.getElementById(killId).innerHTML = "";
      kill = false;
  } else if (dragWorked && dragged.className === "kingRed" && board[parseInt(killId[0])][parseInt(killId[1])] === "white" && kill === true && ableToMove === true){
      board[parseInt(killId[0])][parseInt(killId[1])] = "";
      updateScore(1, 0);
      document.getElementById(killId).innerHTML = "";
      kill = false;
  } else if (dragWorked && dragged.className === "kingWhite" && board[parseInt(killId[0])][parseInt(killId[1])] === "red" && kill === true && ableToMove === true){
    board[parseInt(killId[0])][parseInt(killId[1])] = "";
    updateScore(0, 1);
    document.getElementById(killId).innerHTML = "";
    kill = false;
}

  if (ableToMove && dragWorked) {
    if (event.target.className == "active-cell") {
      event.target.style.background = "";
      dragged.parentNode.removeChild( dragged );
      event.target.appendChild( dragged );
      if (dragged.className === "red") {
        board[parseInt(dropId[0])][parseInt(dropId[1])] = "red";
        kingsRow(event);
      } else if (dragged.className === "white") {
          board[parseInt(dropId[0])][parseInt(dropId[1])] = "white";  
          kingsRow(event);
      } else if (dragged.className === "kingRed") {
          board[parseInt(dropId[0])][parseInt(dropId[1])] = "red";
      } else if (dragged.className === "kingWhite") {
          board[parseInt(dropId[0])][parseInt(dropId[1])] = "white";
      }
    }
  }
// who is the winner
  checkAndAnnounceWinner();
  if (dragWorked && !registerWinner){
    previousPlayer = currentPlayer;
  } else {
      if (currentPlayer === "red") {
        previousPlayer = "white";
      } else if (currentPlayer === "white") {
        previousPlayer = "red";
      }
  } // current turn
  if (currentPlayer === "white" && !registerWinner && dragWorked){
    currentTurnEl.innerHTML = 'TURN:<img src="img/red-piece.png">'
  } else if (currentPlayer === "red" && !registerWinner && dragWorked) {
      currentTurnEl.innerHTML = 'TURN:<img src="img/white-piece.png">'
  } else if (currentPlayer === "kingWhite" && !registerWinner && dragWorked) {
      currentTurnEl.innerHTML = 'TURN:<img src="img/red-piece.png">'
  } else if (currentPlayer === "kingRed" && !registerWinner && dragWorked) {
      currentTurnEl.innerHTML = 'TURN:<img src="img/white-piece.png">'
  }
  firstTurn = false;
}

