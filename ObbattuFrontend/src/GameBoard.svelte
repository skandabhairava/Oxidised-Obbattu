<script>
    import Row from "./Row.svelte";
    import { Letter } from "./LetterContainer/letter";

    export const answer = "abcde"
    const answers = [["a", "b", "c", "d", "e"], ["f", "", "h", "", "j"], ["k", "l", "m", "n", "o"], ["p", "", "r", "", "t"], ["u", "v", "w", "x", "y"]]

    let char_num = 0


    function getRow(row_num) {
        let arr = []
        let state = "incorrect"
        for (let i = 0; i < 5; i++) {
            if ((((i === 0) || (i === 4)) && ((row_num === 0) || (row_num === 4))) || ((i === 2) && (row_num === 2))) {
                state = "correct"
            } else if (answers[row_num][i] === ""){
                state = "blocked"
            } else {
                state = "incorrect"
            }
            arr.push(new Letter(char_num, answers[row_num][i], state))
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

    function swapElements(x1, y1, x2, y2){
        //console.log("SWAPPED!", events)
        if (x1 === x2 && y1 === y2) {
            return;
        }

        let temp = board[x1][y1]
        board[x1][y1] = board[x2][y2]
        board[x2][y2] = temp
    }

    $: {
        if (events.length >= 2) {
            let dragged_from = events.find(event => event.type === "DRAGGED_FROM")
            let dragged_to = events.find(event => event.type === "DRAGGED_TO")
            events = []
            //console.log(dragged_from)
            //console.log(dragged_to)

            swapElements(dragged_from.yPos, dragged_from.xPos, dragged_to.yPos, dragged_to.xPos)
            //console.log(board)
        }
    }

    let board = getBoard()
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