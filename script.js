// Gameboard module
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setMark = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, setMark, resetBoard };
})();

// Player factory
const Player = (name, mark) => ({ name, mark, score: 0 });

// Display controller
const DisplayController = (() => {
  const boardDiv = document.getElementById("gameboard");
  const resultDiv = document.getElementById("result");
  const turnIndicator = document.getElementById("turn-indicator");
  const score1 = document.getElementById("score1");
  const score2 = document.getElementById("score2");

  let winningCells = [];

  const render = () => {
    boardDiv.innerHTML = "";
    Gameboard.getBoard().forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      if (cell) cellDiv.classList.add(cell); // X or O
      cellDiv.textContent = cell;
      cellDiv.addEventListener("click", () => GameController.playTurn(index));
      if (winningCells.includes(index)) cellDiv.classList.add("win");
      boardDiv.appendChild(cellDiv);
    });
  };

  const showResult = (message, winCells = []) => {
    resultDiv.textContent = message;
    winningCells = winCells;
    render();
  };

  const showTurn = (player) => {
    turnIndicator.innerHTML = `<strong>${player.name}'s</strong> turn`;
  };

  const updateScore = (p1Score, p2Score) => {
    score1.textContent = p1Score;
    score2.textContent = p2Score;
  };

  return { render, showResult, showTurn, updateScore };
})();

// Game controller
const GameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let gameOver = false;

  const startGame = (player1Name, player2Name) => {
    players = [Player(player1Name, "X"), Player(player2Name, "O")];
    currentPlayerIndex = 0;
    gameOver = false;
    Gameboard.resetBoard();
    DisplayController.render();
    DisplayController.showTurn(players[currentPlayerIndex]);
    DisplayController.updateScore(players[0].score, players[1].score);
    document.getElementById("result").textContent = "";
  };

  const playTurn = (index) => {
    if (gameOver) return;

    const currentPlayer = players[currentPlayerIndex];
    if (Gameboard.setMark(index, currentPlayer.mark)) {
      const winInfo = checkWin(currentPlayer.mark);
      if (winInfo.win) {
        currentPlayer.score += 1;
        DisplayController.showResult(`${currentPlayer.name} wins!`, winInfo.cells);
        DisplayController.updateScore(players[0].score, players[1].score);
        gameOver = true;
        return;
      }
      if (checkTie()) {
        DisplayController.showResult("It's a tie!");
        gameOver = true;
        return;
      }
      currentPlayerIndex = 1 - currentPlayerIndex; // switch turns
      DisplayController.showTurn(players[currentPlayerIndex]);
      DisplayController.render();
    }
  };

  const checkWin = (mark) => {
    const b = Gameboard.getBoard();
    const winCombos = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (const combo of winCombos) {
      if (combo.every(i => b[i] === mark)) return { win: true, cells: combo };
    }
    return { win: false, cells: [] };
  };

  const checkTie = () => Gameboard.getBoard().every(cell => cell !== "");

  return { startGame, playTurn };
})();

// Event listeners
document.getElementById("start-btn").addEventListener("click", () => {
  const p1 = document.getElementById("player1-name").value || "Player 1";
  const p2 = document.getElementById("player2-name").value || "Player 2";
  GameController.startGame(p1, p2);
});

document.getElementById("restart-btn").addEventListener("click", () => {
  GameController.startGame("Player 1", "Player 2");
});