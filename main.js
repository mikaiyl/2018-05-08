
    /*
     *      Includes
     */

let gameNum = 0;
const log = (...args) => ( console.log(...args), args[0]);

// track turns
const turn = {
    value: ["red", "black"],
    toggle: () => { turn.value.reverse() },
    getCurrentPlayer: () => turn.value[0],
    getLastPlayer: () => turn.value[1],
}

const footer = document.getElementById("footer");
const button = document.createElement("button");
      button.textContent = "Reset Game";
      footer.appendChild(button);

const columns = document.getElementsByClassName("column");
const setCellState = (xVal, yVal, state) => {
    columns[xVal].getElementsByClassName("row-" + yVal)[0].dataset.state = state;
}

    /*
    *      Setup functions
    */

const placeCoin = (columnId) => {
    let player = turn.getCurrentPlayer();
    let index = parseInt(columnId.split("").reverse()[0]);
    // is placeCoin valid?
    if ( currentGame[index].length < 6 ) {
        currentGame[index].push(player);
        turn.toggle();
    }

    renderGameContent(currentGame);
    return [index, currentGame[index].length-1];
}

const runGame = () => {
    for (let column of columns) {
        column.addEventListener("click", () => {
            let pos = placeCoin(column.id);
            findLines(pos[0],pos[1],currentGame);
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

    /*
    *  Show the game in the browser */

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

    document.getElementById("footer").style.zIndex = -3
}
button.onclick = resetGame;

const playerWins = (player) => {

    gameNum++;

    let p = document.createElement("p");
    p.textContent = "The " + player + "player wins game #" + gameNum + "!";

    footer.appendChild(p);
    footer.style.zIndex = 3;

    currentGame = createGameContent();
}

// test win conditions
const findLines = (x,y,game) => {
    let direction = {
        x_axis: {
            left: [ -1 , 0 ],
            right:[ 1 , 0 ]
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

    out: for ( let step in direction ) {
        let totals = {
            x_axis: 0,
            y_axis: 0,
            deg225_45: 0,
            deg135_315: 0
        }

        for ( let section in direction[step] ) {
            const stepX = direction[step][section][0];
            const stepY = direction[step][section][1];

            let inSeries = true;
            for (let i = 1; inSeries == true && i < 4 ; i++) {
                let x_ = stepX * i + x;
                let y_ = stepY * i + y;

                if ( game[x_] ) {
                    debugger;
                    if ( totals[step] > 2 && game[x][y] == turn.getLastPlayer() ) {
                        console.log(totals);
                        playerWins( turn.getLastPlayer() );
                        break out;
                    } else if ( game[x_][y_] == 'undefined' ) {
                        inSeries = false;
                    } else if ( game[x_][y_] == turn.getLastPlayer() ) {
                        totals[step]++;
                    } else if ( game[x_][y_] == turn.getCurrentPlayer() ) {
                        inSeries = false;
                    }
                } else if ( totals[step] > 2 && game[x][y] == turn.getLastPlayer() ) {
                        playerWins( turn.getLastPlayer() );
                        break out;
                } else {
                    break;
                }
            }
        }
    }
}

    /*
    *      Main
    */

( () => {
    runGame();
})();
