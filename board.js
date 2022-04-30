const BOARD_SIZE = 8;
const WHITE_TYPE = 'white';
const DARK_TYPE = 'dark';

let table = document.getElementById("draughts-board")

      if (selectedCell !== undefined) {
        selectedCell.classList.remove('selected');
      }
    
      // Show selected cell
      selectedCell = event.currentTarget;
      selectedCell.classList.add('selected');

window.addEventListener('load', createChessBoard);
