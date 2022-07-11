<script>
    import Row from "./Row.svelte";
    import { Letter } from "../LetterContainer/letter";

    import Content from "../Popups/SolModal/SolModalManager.svelte";
    import Modal from "svelte-simple-modal";

    import { saveObj, getObj } from "../storage.js";

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    //export const answer = "abcde"
    export let questions = [["a", "d", "f", "t", "e"], ["o", "", "j", "", "h"], ["c", "r", "m", "p", "k"], ["w", "", "l", "", "b"], ["u", "x", "n", "v", "y"]]
    export let answers = [["a", "b", "c", "d", "e"], ["e", "j", "o", "t", "y"], ["a", "f", "k", "p", "u"], ["u", "v", "w", "x", "y"], ["c", "h", "m", "r", "w"], ["k", "l", "m", "n", "o"]]
    export let ans_to_show = [["a", "b", "c", "d", "e"], ["f", "", "h", "", "j"], ["k", "l", "m", "n", "o"], ["p", "", "r", "", "t"], ["u", "v", "w", "x", "y"]]
    export let TOTAL_MOVES = 20
    export let OBBATTU_COUNT = 0

    let GAME_STATE = "playing"

    $: MOVES = TOTAL_MOVES

    let char_num = 0

    function getRow(row_num, ans = false) {
        let arr = []
        let state = "incorrect"
        for (let i = 0; i < 5; i++) {
            if (ans === false){
                if ((((i === 0) || (i === 4)) && ((row_num === 0) || (row_num === 4))) || ((i === 2) && (row_num === 2))) {
                    state = "correct"
                } else if (questions[row_num][i] === ""){
                    state = "blocked"
                } else {
                    state = "incorrect"
                }
                arr.push(new Letter(char_num, questions[row_num][i], state))
            } else {
                if (ans_to_show[row_num][i] === "") {
                    state = "blocked"
                } else {
                    state = "correct"
                }
                arr.push(new Letter(char_num, ans_to_show[row_num][i], state))
            }
            char_num++
        }

        return arr;
    }

    function getBoard(ans = false) {
        let board = []
        for (let i = 0; i < 5; i++) {
            board.push(getRow(i, ans))
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

        if (y === 0 && answers[0].includes(temp.letter)){
            if (answers[0][x] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else if (x === 0 && answers[2].includes(temp.letter)) {
            if (answers[2][y] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else if (y === 4 && answers[3].includes(temp.letter)) {
            if (answers[3][x] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else if (x === 4 && answers[1].includes(temp.letter)) {
            if (answers[1][y] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else if (x === 2 && answers[4].includes(temp.letter)) {
            if (answers[4][y] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else if (y === 2 && answers[5].includes(temp.letter)) {
            if (answers[5][x] === temp.letter) {
                temp.state = "correct"
            } else {
                temp.state = "misplaced"
            }
        } else {
            temp.state = "incorrect"
        }

        return temp
    }

    function saveSnapshot() {
        //console.log("saving snapshot...")

        let GAME_BOARD = {
            questions: questions,
            MOVES: MOVES,
        }
        saveObj("GAME_BOARD", GAME_BOARD)
    }

    function debounce(func, timeout = 300){
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    let debounceSave = debounce(saveSnapshot, 500)
    
    function checkGameState(extra = true) {

        //console.log("checking state...")
        //console.log(board)

        for (let i = 0; i < board.length; i++){
            for (let j = 0; j < board[i].length; j++) {
                if ((board[i][j].state === "incorrect") || (board[i][j].state === "misplaced")) {
                    if (MOVES <= 0) {
                        board = endGame(board, false)
                        dispatch('GAME_LOST', {extra: extra});
                        saveSnapshot()
                        //console.log(board)
                    }
                    return
                }
            }
        }
        
        board = endGame(board, true)
        dispatch('GAME_WON', {extra: extra});
        
        saveSnapshot()
        //console.log("extra from checkGameState", extra)
    }

    function swapElements(x1, y1, x2, y2){

        if (x1 === x2 && y1 === y2) {
            return;
        }

        MOVES -= 1;

        let temp = checkPosition(y2, x2, board[x1][y1])
        let temp2 = checkPosition(y1, x1, board[x2][y2])
        // I dont know why its like (y, x), even if its designed to be like (x, y), it works, so im not going to question this

        board[x1][y1] = temp2
        board[x2][y2] = temp

        let questionsTemp = questions[x2][y2]
        questions[x2][y2] = questions[x1][y1]
        questions[x1][y1] = questionsTemp

        debounceSave()

        checkGameState()
    }

    function endGame(board, won = false) {

        if (won === false){
            GAME_STATE = "lost"
        } else {
            GAME_STATE = "won"
        }

        for (let i = 0; i < board.length; i++){
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].state != "blocked"){
                    if (won === true){
                        board[i][j].state = "game_won"
                    } else {
                        board[i][j].state = "game_lost"
                    }
                }
            }
        }

        return board
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
    let ans_board = getBoard(true)

    for (let i = 0; i < board.length; i++){
        for (let j = 0; j < board[i].length; j++) {
            checkPosition(j, i, board[i][j])
        }
    }

    setTimeout(
        () => checkGameState(false),
        1
    )
    
    //console.log(board)
</script>

<div class="board-container flexx">
    <div class="daily-obbattu-count">
        <p>daily obbattu <strong>#{OBBATTU_COUNT}</strong></p>
    </div>
    <div class="game-board">
        {#key board}
            {#each board as row, i}
                <Row row_list={row} col={i}

                on:DRAGGED_FROM={handleCustomEvent}
                on:DRAGGED_TO={handleCustomEvent}/>
            {/each}
        {/key}
    </div>
    <div class="moves-counter flexx">
        {#if GAME_STATE === "playing"}
            <p>You have <strong>{MOVES}</strong> {(MOVES === 1)?"Move":"Moves"} available!</p>
        {:else if GAME_STATE === "lost"}
            <p>You <strong>lost</strong> the game</p>
        {:else}
            <p class="moves-playing">You <strong>won</strong> the game with <strong>{MOVES}</strong> {(MOVES === 1)?"Move":"Moves"} remaining!</p>
        {/if}
    </div>
    <Modal
        classContent="modal"
    >
        {#if GAME_STATE === "lost"}
            <Content board={ans_board}/>
        {/if}
    </Modal>
</div>

<style>

    .board-container {

        /* border: 2px solid red; */
        width: 100%;

        /* display: flex;
        justify-content: center;
        align-items: center; */
        flex-grow: 1;
        /* overflow: hidden; */
        flex-direction: column;
        /* border: 5px solid pink; */
    }

    strong {
        color: var(--font-color);
    }

    .daily-obbattu-count {
        letter-spacing: 4px;
        font-size: large;
        text-transform: uppercase;
        color: var(--subtitle-color);
    }

    .moves-counter {
        /* border: 5px solid red; */
        font-size: x-large;
        margin-top: 3em;
        /* border: 1px solid red; */
        /* display: flex;
        align-items: center;
        justify-content: center; */
        width: 100%;
        height: 4em;

        color: var(--subtitle-color);
        background-color: var(--popup-bg-color);

        /* text-align: center */
    }

    .game-board {
        width: 350px;
        height: 355px;
        display: grid;
        grid-template-rows: repeat(5, 1fr);
        /* grid-template-rows: auto; */
        grid-gap: 10px;
        box-sizing: border-box;

        /* padding: 10px; */

        /* border: 5px solid blueviolet; */
    }

    @media (max-width: 700px) {
        .game-board {
            width: 347px;
            height: 352px;
        }

        .moves-counter {
            font-size: larger;
        }
    }
</style>