//Gameboard

function Gameboard (){
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

    const placeMarker = (row, column, player) => {
        if(board[row][column].getValue() !== '')
            return 'Cell Played Already';

        board[row][column].addMarker(player);
    }

    initBoard();

    return {
        getBoard,
        placeMarker,
    };

}

function cell() {
    let value = 0;

    const addMarker = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addMarker,
        getValue,
    };

}

function gameController(playerOne = 'O', playerTwo = 'X') {
    const board = Gameboard();

    const players = [
        {
            name:playerOne,
            marker:'O'
        },
        {
            name:playerTwo,
            marker:'X'
        }
    ];

    
}