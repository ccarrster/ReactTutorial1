import { useState } from "react";

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
        return lines[i];
      }
    }
    return null;
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const rows = [];
  let squareId = 0;
  for (let i = 0; i < 3; i++) {
    const rowSquares = [];
    let rowId = i;
    for (let j = 0; j < 3; j++) {
      let thisSquareId = squareId;
      rowSquares.push(
        <Square
          key={thisSquareId}
          value={squares[thisSquareId]}
          winning={winner && winner.includes(thisSquareId)}
          onSquareClick={() => handleClick(thisSquareId)}
        />
      );
      squareId += 1;
    }
    rows.push(
      <div key={rowId} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [reversed, setReversed] = useState(0);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [currentWinnings, setWinnings] = useState([Array(9).fill(false)]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function reverseMoves() {
    setReversed(!reversed);
  }

  const moves = reversed
    ? history.map(renderMoves).reverse()
    : history.map(renderMoves);

  function renderMoves(squares, move) {
    let description;
    let row = 0;
    let col = 0;
    if (move > 0) {
      for (let i = 0; i < history[move].length; i++) {
        if (history[move][i] != history[move - 1][i]) {
          col = (i % 3) + 1;
          row = Math.floor(i / 3) + 1;
        }
      }
    }

    if (move > 0) {
      if (move == currentMove) {
        description =
          "You are at move #" + move + " (" + row + ", " + col + ")";
        return <li key={move}>{description}</li>;
      } else {
        description = "Go to move #" + move + " (" + row + ", " + col + ")";
      }
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {<button onClick={() => jumpTo(move)}>{description}</button>}
      </li>
    );
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          winnings={currentWinnings}
          onWinning={setWinnings}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div>
        <button onClick={reverseMoves}>Reverse Moves</button>
      </div>
    </div>
  );
}

function Square({ value, winning, onSquareClick }) {
  return (
    <button
      className={winning === true ? "square win" : "square"}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
