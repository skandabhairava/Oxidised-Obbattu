<script>
    export let board
    import Row from "./Row.svelte";
</script>

<div class="main-popup">
    <h1>Solution</h1>
    <div class="board-container">
        <div class="game-board">
            {#each board as row, i}
                <Row row_list={row} col={i}/>
            {/each}
        </div>
    </div>
</div>

<style>
    h1 {
        font-size: x-large;
    }

    .main-popup {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        overflow: hidden;

        flex-direction: column;
    }

    .board-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        overflow: hidden;
        flex-direction: column;
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
        margin-bottom: 1em;
        /* padding-bottom: 1em; */

        /* border: 5px solid blueviolet; */
    }
</style>