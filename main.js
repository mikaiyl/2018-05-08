    /*
     *      Includes
     */

// track moves as [x, y] pairs
const moves = {
    black: [],
    red: []
};

// track turns
const turn = {
    value: ["red", "black"],
    toggle: () => { turn.value.reverse() }
}
const getTurn = () => {
    return turn.value[0];
}
// get elements
const columns = document.getElementsByClassName("column");
const setCellState = (xVal, yVal, state) => {
    columns[xVal].getElementsByClassName("row-" + yVal)[0].dataset.state = state;
}

    /*
     *      Setup functions
     */

const move = (columnId) => {
    let player = getTurn();
    let index = parseInt(columnId.split("").reverse()[0]);
    // is move valid?
    if ( currentGame[index].length < 6 ) {
        currentGame[index].push(player);
        moves[player].push([index, currentGame[index].length-1]);
        turn.toggle();
    }

    renderGameContent(currentGame);
    return [index, currentGame[index].length-1];
}

///// For all columns when clicked add a coin
// then change the turn and add to the play arrays
const setupColumns = () => {
    for (let column of columns) {
        column.addEventListener("click", () => {
            let pos = move(column.id);
            console.log(pos);
            linearCheck(pos[0],pos[1],currentGame);
        });
    }
}

// board setup
const createGameContent = () => {
    let gameArray = [];
    for (let i = 0; i < 7; i++) {
        let column = [];
        gameArray.push(column);
    }
    return gameArray;
}

var currentGame = createGameContent();

const renderGameContent = (gameArray) => {
    for (let k in gameArray) {
        for (let l in gameArray[k]){
            setCellState(k,l,gameArray[k][l]);
        }
    }
}

const resetGame = () => {
    turn.value = ["red", "black"];
    for ( let div of document.getElementsByClassName("cell")) {
        div.dataset.state = "unset";
    }
}

// test win conditions
const linearCheck = (x,y,game) => {
    let steps = {
        x_axis: {
            down: [ -1 , 0 ],
            up:[ 1 , 0 ]
        },           //    -
        y_axis: {
            down: [ 0 , -1 ],
            up:[ 0 , 1 ]
        },           //    |
        deg225_45: {
            down: [ -1 , -1 ],
            up: [ 1 , 1 ]
        },           //    /
        deg135_315: {
            down: [ -1 , 1 ],
            up: [ 1 , -1 ]
        }          //    \
    }

    let totals = {
        red: {
            x_axis: 1,
            y_axis: 1,
            deg225_45: 1,
            deg135_315: 1
        }, black: {
            x_axis: 1,
            y_axis: 1,
            deg225_45: 1,
            deg135_315: 1
        }
    }

    for ( let step in steps ) {
        for ( let section in steps[step] ) {
            let stepX = steps[step][section][0];
            let stepY = steps[step][section][1];

            console.log("124: "+ stepX );
            if ( stepX + x >= 0  ) {
                for (let i = 0;  ; i++) {

                    let x_ = stepX * i + x;
                    let y_ = stepY * i + y;

                    if ( x_ >= 0 && x_ < 7 && y_ >= 0 && y_ < 6 ){
                        console.log(totals);
                        if ( i > 4 ) {
                            break;
                        } else if ( totals.red[step] > 3 || totals.black[step] > 3 ) {
                            return getTurn();
                        } else if ( game[x_][y_] == 'red' ) {
                            totals.red[step]++;
                        } else if ( game[x_][y_] == 'black' ) {
                            totals.black[step]++;
                        }
                    } else if ( i > 6 ) {
                        break;
                    } else {
                        console.log("cont...")
                        continue;
                    }
                }
            }
        }
    }
}

const testForWin = ( movesArray ) => {}

    /*
     *      Main
     */

( () => {
    setupColumns();
})();
