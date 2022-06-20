<script>
    import LetterComponenet from "../../LetterContainer/Letter.svelte";
    import {Letter} from "../../LetterContainer/letter.js";
</script>

<div class="main-popup">
    <h1>Help</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent gravida urna nec diam hendrerit egestas. Morbi non dictum dui. Fusce rutrum magna ante, vel fringilla magna euismod luctus. Vestibulum venenatis id nibh sed eleifend. Nulla accumsan risus ex. Donec ullamcorper, nibh in finibus egestas, nunc arcu viverra felis, a venenatis massa justo eu est. Nunc ac fermentum urna.</p>
    <hr>
    <div class="limit-letter">
        <LetterComponenet letter={new Letter(undefined, "a", "correct")}/>
    </div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent gravida urna nec diam hendrerit egestas. Morbi non dictum dui. </p>
    <div class="limit-letter">
        <LetterComponenet letter={new Letter(undefined, "a", "misplaced")}/>
    </div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent gravida urna nec diam hendrerit egestas. Morbi non dictum dui. </p>
    <div class="limit-letter">
        <LetterComponenet letter={new Letter(undefined, "a", "incorrect")}/>
    </div>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent gravida urna nec diam hendrerit egestas. Morbi non dictum dui. </p>
    <hr>
    <h1>Credits</h1>
    <div class="credits">
        <div class="dict">
            <div class="item">
                <p>Made by</p>
            </div>
            <div class="item">
                <a href="https://github.com/skandabhairava">Skanda M B</a>
            </div>
            <div class="item">
                <p>Inspired from</p>
            </div>
            <div class="item">
                <a href="https://wafflegame.net/">WaffleGame</a>
                <a href="https://www.nytimes.com/games/wordle/index.html">Wordle</a>
                <a href="https://wordalla.online/">Wordalla</a>
            </div>
        </div>
    </div>
</div>

<style>

    .dict {
        justify-content: center;
        align-items: center;

        display: grid;
        grid-template-columns: 100% 100%;
        /* padding: 20px; */
    }

    .item {
        text-align: center;
        /* border: 1px solid rgba(0, 0, 0, 0.8); */
        /* width: 100%; */
    }

    @media (max-width: 700px) {
        .dict {
            grid-template-columns: 50% 50%;
        }
    }

    .limit-letter {
        width: 60px;
        height: auto;
        aspect-ratio: 1/1;
    }

    h1 {
        font-size: x-large;
        font-weight: bold;
        letter-spacing: 5px;
    }

    hr {
        width: 100%;
        color: antiquewhite;
    }

    .main-popup {
        color: var(--font-color);

        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        overflow: hidden;
        flex-direction: column;

        font-size: large;
    }
</style>