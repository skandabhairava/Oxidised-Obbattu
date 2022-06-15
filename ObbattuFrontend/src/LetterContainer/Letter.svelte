<script>
    export let letter
</script>

<div class="letter"
  class:game_end={letter.state === "game_end"}
  class:incorrect={letter.state === "incorrect"}
  class:misplaced={letter.state === "misplaced"}
  class:correct={letter.state === "correct"}>
    {#if letter.letter}
        {letter.letter}
    {/if}
</div>

<style>
    .letter {
        font-size: 2rem;
        display: inline-flex;
        font-weight: bold;
        vertical-align: middle;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        user-select: none;
        line-height: 2rem;
        color: var(--text-color);
        text-transform: uppercase;

        /* transition: background-color 1s linear; */
    }

    .incorrect, .misplaced, .correct, .game_end {
        color: var(--guessed-letter-color);
        border: 2px solid var(--border-color);
        border: none;
        border-radius: 5px;
    }

    .incorrect {
        background-color: var(--incorrect-bg);
        box-shadow: 0px 5px 0px var(--incorrect-shadow);
    }

    .game_end {
        background-color: var(--game-end-bg);
        box-shadow: 0px 5px 0px var(--game-end-shadow);
    }

    .misplaced {
        background-color: var(--misplaced-bg);
        box-shadow: 0px 5px 0px var(--misplaced-shadow);
    }

    .correct {
        background-color: var(--correct-bg);
        box-shadow: 0px 5px 0px var(--correct-shadow);
    }
</style>