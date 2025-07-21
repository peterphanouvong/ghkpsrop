"use client";
import { useState, useCallback, useMemo } from "react";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board) {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return { winner: board[a], combination: combo };
    }
  }
  return null;
}

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  
  const gameResult = useMemo(() => checkWinner(board), [board]);
  const winner = gameResult?.winner;
  const winningCombination = gameResult?.combination;
  
  const isDraw = useMemo(() => 
    !winner && board.every(cell => cell !== null), 
    [board, winner]
  );

  const handleClick = useCallback((index) => {
    if (board[index] || winner) return;
    
    setBoard(prevBoard => {
      const newBoard = [...prevBoard];
      newBoard[index] = xIsNext ? "X" : "O";
      return newBoard;
    });
    setXIsNext(prev => !prev);
  }, [board, winner, xIsNext]);

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }, []);

  const getButtonStyles = (index) => {
    const isWinning = winningCombination?.includes(index);
    const baseStyles = `
      aspect-square font-bold text-4xl rounded-lg
      border-2 transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-4 focus:ring-blue-300/50
      transform hover:scale-105 active:scale-95
    `;
    
    if (isWinning) {
      return `${baseStyles} bg-green-400 dark:bg-green-600 border-green-500 dark:border-green-400 text-white shadow-lg`;
    }
    
    return `${baseStyles} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 
      hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500
      text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg`;
  };

  const getStatusMessage = () => {
    if (winner) return { text: `🎉 Player ${winner} wins!`, color: "text-green-600 dark:text-green-400" };
    if (isDraw) return { text: "🤝 It's a draw!", color: "text-yellow-600 dark:text-yellow-400" };
    return { 
      text: `Player ${xIsNext ? "X" : "O"}'s turn`, 
      color: xIsNext ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400" 
    };
  };

  const status = getStatusMessage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Tic Tac Toe
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={getButtonStyles(index)}
              disabled={Boolean(cell) || Boolean(winner)}
              aria-label={`Cell ${index + 1}`}
            >
              <span className={cell === "X" ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}>
                {cell}
              </span>
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <p className={`text-xl font-semibold ${status.color} transition-colors duration-200`}>
            {status.text}
          </p>
        </div>

        <button
          onClick={resetGame}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 
            text-white font-semibold rounded-xl shadow-lg
            hover:from-blue-700 hover:to-purple-700 
            focus:outline-none focus:ring-4 focus:ring-blue-300/50
            transition-all duration-200 ease-in-out
            transform hover:scale-105 active:scale-95"
        >
          🔄 New Game
        </button>
      </div>
    </div>
  );
}