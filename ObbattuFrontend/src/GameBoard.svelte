<script>
    import Row from "./Row.svelte";
    import { Letter } from "./LetterContainer/letter";

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export const answer = "abcde"
    //const answers = [["a", "b", "c", "d", "e"], ["f", "", "h", "", "j"], ["k", "l", "m", "n", "o"], ["p", "", "r", "", "t"], ["u", "v", "w", "x", "y"]]
    const questions = [["a", "d", "f", "t", "e"], ["o", "", "j", "", "h"], ["c", "r", "m", "p", "k"], ["w", "", "l", "", "b"], ["u", "x", "n", "v", "y"]]
    const answerHintMap = [["a", "b", "c", "d", "e"], ["e", "j", "o", "t", "y"], ["a", "f", "k", "p", "u"], ["u", "v", "w", "x", "y"], ["c", "h", "m", "r", "w"], ["k", "l", "m", "n", "o"]]
    // top, right, left, down, vert, horz

    let char_num = 0

    function getRow(row_num) {
        let arr = []
        let state = "incorrect"
        for (let i = 0; i < 5; i++) {
            if ((((i === 0) || (i === 4)) && ((row_num === 0) || (row_num === 4))) || ((i === 2) && (row_num === 2))) {
                state = "correct"
            } else if (questions[row_num][i] === ""){
                state = "blocked"
            } else {
                state = "incorrect"
            }
            arr.push(new Letter(char_num, questions[row_num][i], state))
            char_num++
        }

        return arr;
    }

    function getBoard() {
        let board = []
        for (let i = 0; i < 5; i++) {
            board.push(getRow(i))
        }
        return board
    }

    let events = []

    function handleCustomEvent(event){
        //console.log(event.detail)
        for (let i = 0; i < events.length; i++) {
            if (events[i].type === event.detail.type) {
                events = []
                return;
            }
        }
        events = [...events, event.detail]
        //console.log("An event occured", events.length, events)
        setTimeout(() => {
            if((events.length > 0)){
                //console.log("No double event occured")
                events = []
            }
        }, 500);
    }

    function checkPosition(x, y, temp){

        if (temp.state === "blocked") {
            return temp
        }

        if (y === 0 && answerHintMap[0].includes(temp.letter)){
            if (answerHintMap[0][x] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else if (x === 0 && answerHintMap[2].includes(temp.letter)) {
            if (answerHintMap[2][y] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else if (y === 4 && answerHintMap[3].includes(temp.letter)) {
            if (answerHintMap[3][x] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else if (x === 4 && answerHintMap[1].includes(temp.letter)) {
            if (answerHintMap[1][y] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else if (x === 2 && answerHintMap[4].includes(temp.letter)) {
            if (answerHintMap[4][y] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else if (y === 2 && answerHintMap[5].includes(temp.letter)) {
            if (answerHintMap[5][x] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else {
            temp.state = "incorrect"
        }

        return temp
    }

    function swapElements(x1, y1, x2, y2){
        if (x1 === x2 && y1 === y2) {
            return;
        }

        let temp = checkPosition(y2, x2, board[x1][y1])
        let temp2 = checkPosition(y1, x1, board[x2][y2])
        // I dont know why its like (y, x), even if its designed to be like (x, y), it works, so im not going to question this

        board[x1][y1] = temp2
        board[x2][y2] = temp

        for (let i = 0; i < board.length; i++){
            for (let j = 0; j < board[i].length; j++) {
                if ((board[i][j].state === "incorrect") || (board[i][j].state === "misplaced")) {
                    return
                }
            }
        }

        dispatch('GAME_WON', {
            text: 'GAME_WON',
        });
    }

    $: {
        if (events.length >= 2) {
            let dragged_from = events.find(event => event.type === "DRAGGED_FROM")
            let dragged_to = events.find(event => event.type === "DRAGGED_TO")
            events = []

            swapElements(dragged_from.yPos, dragged_from.xPos, dragged_to.yPos, dragged_to.xPos)
            // I dont know why its like (y1, x1; y2, x2), even if its designed to be like (x1, y1; x2, y2), it works, so im not going to question this
        }
    }

    let board = getBoard()

    for (let i = 0; i < board.length; i++){
        for (let j = 0; j < board[i].length; j++) {
            checkPosition(j, i, board[i][j])
        }
    }
    
    //console.log(board)
</script>

<div class="board-container">
    <div class="game-board">
        {#key board}
            {#each board as row, i}
                <Row row_list={row} col={i}

                on:DRAGGED_FROM={handleCustomEvent}
                on:DRAGGED_TO={handleCustomEvent}/>
            {/each}
        {/key}
    </div>
</div>

<style>
    .board-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        overflow: hidden;
    }

    .game-board {
        width: 350px;
        height: 420px;
        display: grid;
        grid-template-rows: repeat(6, 1fr);
        grid-gap: 10px;
        padding: 10px;
        box-sizing: border-box;
    }

    @media (max-width: 700px) {
        .game-board {
            width: 347px;
            height: 414px;
        }
    }
</style>