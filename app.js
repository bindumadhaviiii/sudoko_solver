document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("sudoku-board");
    const solveBtn = document.getElementById("solve-btn");
    const resetBtn = document.getElementById("reset-btn");
    const message = document.getElementById("message");

    // Create an empty board
    const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(null));

    // Function to create the board UI
    const createBoard = (boardData) => {
        board.innerHTML = "";
        boardData.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                const cellElement = document.createElement("div");
                cellElement.classList.add("sudoku-cell");
                if (cell !== null) {
                    cellElement.innerText = cell;
                } else {
                    const input = document.createElement("input");
                    input.type = "number";
                    input.min = 1;
                    input.max = 9;
                    cellElement.appendChild(input);
                }
                board.appendChild(cellElement);
            });
        });
    };

    // Get the current board data from the UI
    const getBoardData = () => {
        const boardData = [];
        const cells = document.querySelectorAll(".sudoku-cell");
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            if (!boardData[row]) boardData[row] = [];
            if (cell.innerText) {
                boardData[row][col] = parseInt(cell.innerText, 10);
            } else if (cell.firstElementChild && cell.firstElementChild.value) {
                boardData[row][col] = parseInt(cell.firstElementChild.value, 10);
            } else {
                boardData[row][col] = null;
            }
        });
        return boardData;
    };

    // Check if a number can be placed in a specific cell
    const isValid = (boardData, row, col, num) => {
        for (let i = 0; i < 9; i++) {
            if (boardData[row][i] === num || boardData[i][col] === num || 
                boardData[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] === num) {
                return false;
            }
        }
        return true;
    };

    // Solve the Sudoku puzzle using backtracking
    const solveSudoku = (boardData) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (boardData[row][col] === null) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(boardData, row, col, num)) {
                            boardData[row][col] = num;
                            if (solveSudoku(boardData)) {
                                return true;
                            }
                            boardData[row][col] = null;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    // Validate the Sudoku board and show the solution if solvable
    const validateAndSolve = () => {
        const boardData = getBoardData();
        if (solveSudoku(boardData)) {
            createBoard(boardData);
            message.innerText = "Sudoku solved successfully!";
            message.style.color = "green";
        } else {
            message.innerText = "No solution exists for the given Sudoku.";
            message.style.color = "red";
        }
    };

    // Reset the Sudoku board to its initial state
    const resetGame = () => {
        createBoard(emptyBoard);
        message.innerText = "";
    };

    solveBtn.addEventListener("click", validateAndSolve);
    resetBtn.addEventListener("click", resetGame);

    // Initialize the board on page load
    resetGame();
});

