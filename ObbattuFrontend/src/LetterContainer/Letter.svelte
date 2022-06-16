<script>
    export let letter
</script>

<div class="letter"
  class:game_lost={letter.state === "game_lost"}
  class:game_won={letter.state === "game_won"}
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

    .incorrect, .misplaced, .correct, .game_lost, .game_won {
        color: var(--guessed-letter-color);
        border: 2px solid var(--border-color);
        border: none;
        border-radius: 5px;
    }

    .incorrect {
        background-color: var(--incorrect-bg);
        box-shadow: 0px 5px 0px var(--incorrect-shadow);
    }

    .game_lost {
        background-color: var(--game-end-bg);
        box-shadow: 0px 5px 0px var(--game-end-shadow);
    }

    .game_won {
        animation: rainbow-bg 10s linear;
		animation-iteration-count: infinite;
    }

    .misplaced {
        background-color: var(--misplaced-bg);
        box-shadow: 0px 5px 0px var(--misplaced-shadow);
    }

    .correct {
        background-color: var(--correct-bg);
        box-shadow: 0px 5px 0px var(--correct-shadow);
    }

    @keyframes rainbow-bg{
		100%,0%{
			background-color: rgb(113, 37, 37);
		}
		8%{
			background-color: rgb(131, 67, 2);
		}
		16%{
			background-color: rgb(111, 90, 37);
		}
		25%{
			background-color: rgb(78, 114, 41);
		}
		33%{
			background-color: rgb(37, 116, 37);
		}
		41%{
			background-color: rgb(7, 116, 61);
		}
		50%{
			background-color: rgb(0, 139, 139);
		}
		58%{
			background-color: rgb(37, 77, 116);
		}
		66%{
			background-color: rgb(42, 42, 108);
		}
		75%{
			background-color: rgb(70, 34, 106);
		}
		83%{
			background-color: rgb(102, 37, 102);
		}
		91%{
			background-color: rgb(114, 26, 70);
		}
    }
</style>