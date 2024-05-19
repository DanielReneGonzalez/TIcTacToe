//Gameboard

function gameboard (){
    const rows = 3;
    const columns = 3;
    const board = [];

    const initBoard = () => {
        for (let i = 0; i < rows; i++){
            board[i] = [];
                for (let j = 0; j < columns; j++){
                    board[i].push(cell());
                }
        }
    }

    const getBoard = () => board;

    const placeToken = (row, column, player) => {
//Stops Player from playing taken cell. Ref line: 124 -131
        if (board[row][column].getValue() !== "") 
            {return "error"}
        else    {
            board[row][column].addToken(player)
        }
    }

    initBoard();

    return {
        getBoard,
        placeToken,
    };

}

function cell() {
    let value = '';

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addToken,
        getValue,
    };

}

function createPlayer(playerName,playerToken) {
    const name = playerName;
    const token = playerToken;

    return {
        name,
        token
    };
}

function gameController(playerOneName = 'Player 1', playerTwoName = 'Player 2') {
    const board = gameboard();

    const playerOne = createPlayer(playerOneName, 'X');
    const playerTwo = createPlayer(playerTwoName, 'O');
    const players = [playerOne,playerTwo];

    let result = {
        win: false,
        token: ''
    }
    
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const checkResult = () => {
        for (let i = 0; i < 3; i++) {
            //Check columns
            if (board.getBoard()[0][i].getValue() === board.getBoard()[1][i].getValue() &&
                board.getBoard()[1][i].getValue() === board.getBoard()[2][i].getValue() &&
                board.getBoard()[0][i].getValue() !== '') {
                    result.win = true;
                    result.token = board.getBoard()[0][i].getValue();
                }
            //Check rows
            if (board.getBoard()[i][0].getValue() === board.getBoard()[i][1].getValue() &&
                board.getBoard()[i][1].getValue() === board.getBoard()[i][2].getValue() &&
                board.getBoard()[i][0].getValue() !== '') {
                    result.win = true;
                    result.token = board.getBoard()[i][0].getValue();
                }
        }
            //Check diagonal
            if (board.getBoard()[0][0].getValue() === board.getBoard()[1][1].getValue() &&
                board.getBoard()[1][1].getValue() === board.getBoard()[2][2].getValue() &&
                board.getBoard()[0][0].getValue() !== '') {
                    result.win = true;
                    result.token = board.getBoard()[0][0].getValue();
                }
            
            if (board.getBoard()[0][2].getValue() === board.getBoard()[1][1].getValue() &&
                board.getBoard()[1][1].getValue() === board.getBoard()[2][0].getValue() &&
                board.getBoard()[0][2].getValue()!== '') {
                    result.win = true;
                    result.token = board.getBoard()[0][2].getValue();
                }
            //Check tie 
            if (board.getBoard().every(row => row.every(cell => cell.getValue() !== ''))) {
                result.win = true;
                result.token = 'tie';
                console.log('tie');
            }
            return result;

    }



    const playRound = (row, column) => {
        if (board.placeToken(row, column, getActivePlayer().token) !== 'error') {
            board.placeToken(row, column, getActivePlayer().token);
                
            if (checkResult().win === true) return;

            switchPlayerTurn();
        }
    }

    return {
        getActivePlayer,
        playRound,
        getBoard: board.getBoard,
        checkResult,
    }

}

function screenController(player1, player2) {
    let p1 = player1;
    let p2 = player2;
    const game = gameController(p1, p2);

    const playerTurnDiv = document.querySelector('.player-turn');
    const boardDiv = document.querySelector('.board');
    const resetBtn = document.querySelector('.reset');
    const playersBtn = document.querySelector('.names-modal');
    const modal = document.querySelector('dialog');
    const form = document.querySelector('form');
    const submitBtn = document.querySelector('.submitButton');
    let result;

    const updateScreen = () => {
        result = game.checkResult()
        boardDiv.textContent = "";

        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        
        if (result.win === true) {
            if (result.token === "tie") {
                playerTurnDiv.textContent = "It's a tie game, no one wins !"
            } else {
                playerTurnDiv.textContent = `${activePlayer.name} wins !`;
            }
        } else {
            playerTurnDiv.textContent = `It's ${activePlayer.name}'s turn !`;
        }
        // Creates board 
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const cellButton = document.createElement('button')
                cellButton.classList.add('cell');
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                cellButton.textContent = board[i][j].getValue();

                if (result.win === true) {
                    cellButton.disabled = true
                }

                boardDiv.appendChild(cellButton);
            }
        }
    }

    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        if (!selectedColumn) return;
        if (!selectedRow) return;
       
        game.playRound(selectedRow, selectedColumn)
        
        updateScreen();
    }

    function submitNames(e) {
        const input1 = document.querySelector('#p1');
        const input2 = document.querySelector('#p2');
        screenController(input1.value, input2.value);
        console.log('I print');
        form.reset();
    }

    function resetDisplay() {
        screenController(p1, p2);
    }

    submitBtn.addEventListener('click', submitNames, modal.close());
    boardDiv.addEventListener('click', clickHandlerBoard);
    resetBtn.addEventListener('click', resetDisplay, { once: true });
    playersBtn.addEventListener('click', () => {
        modal.showModal();
    });

    updateScreen();

}

screenController();