import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 1 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    // create array-of-arrays of true/false values
    for (let i = 0; i < ncols; i++) {
      let row = [];
      for (let j = 0; j < nrows; j++) {
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  console.log(board);

  function hasWon() {
    // check the board in state to determine whether the player has won.
    return board.every((row) => row.every((cell) => !cell));
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      // covert y, x to Integer
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map((row) => [...row]);

      // in the copy, flip this cell [y, x] and the cells around it
      flipCell(y, x, boardCopy);
      // left [y, x-1]
      flipCell(y, x - 1, boardCopy);
      // right [y, x+1]
      flipCell(y, x + 1, boardCopy);
      // top [y-1, x]
      flipCell(y - 1, x, boardCopy);
      // bottom [y+1, x]
      flipCell(y + 1, x, boardCopy);

      // return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  if (hasWon()) {
    return <h2>You Won!</h2>;
  }

  // make table board

  let tableBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      row.push(
        <Cell
          key={coord}
          flipCellsAroundMe={() => flipCellsAround(coord)}
          isLit={board[y][x]}
        />
      );
    }
    tableBoard.push(<tr>{row}</tr>);
  }

  return (
    <table>
      <tbody>{tableBoard}</tbody>
    </table>
  );
}

export default Board;
