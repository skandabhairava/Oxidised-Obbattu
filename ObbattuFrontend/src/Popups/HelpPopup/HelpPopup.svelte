<script>
    import LetterComponenet from "../../LetterContainer/Letter.svelte";
    import {Letter} from "../../LetterContainer/letter.js";
</script>

<div class="main-popup flexx">
    <h1>ಆಟದ ಬಗ್ಗೆ</h1>
    <p>ಒಬ್ಬಟ್ಟು ಆಡುವ ವಿಧಾನ. ಪ್ರತಿಯೊಂದು ಆಟವನ್ನು 20 ಅಥವಾ ಕಡಿಮೆ ಚಲನೆಗಳಲ್ಲಿ ಮುಗಿಸಬಹುದು. ಅಕ್ಷರಗಳನ್ನು ಸರಿಯಾಗಿ ಜೋಡಿಸಿ ಪದಗಳನ್ನು ಮಾಡಿ, ಅಡ್ಡವಾಗಿ ಮತ್ತು ಉದ್ದವಾಗಿ.</p>
    <hr>
    <div class="limit-letter">
        <LetterComponenet letter={new Letter(undefined, "ಅ", "correct")}/>
    </div>
    <p>ಹಸಿರು ಬಣ್ಣದ ಅಕ್ಷರ ಪದದಲ್ಲಿ ಸರಿಯಾದ ಜಾಗದಲ್ಲಿ ಇದೆ. ಹಸಿರು ಬಣ್ಣದ ಅಕ್ಷರಗಳನ್ನು ಬಿಟ್ಟು ಬೇರೆ ಅಕ್ಷರಗಳನ್ನು ಬೇರೆ ಜಾಗಕ್ಕೆ ಚಲಿಸಬಹುದು.</p>
    <div class="limit-letter">
        <LetterComponenet letter={new Letter(undefined, "ಅ", "misplaced")}/>
    </div>
    <p>ಹಳದಿ ಬಣ್ಣದ ಅಕ್ಷರ ಪದದಲ್ಲಿ ಇದೆ ಆದರೆ ಸರಿಯಾದ ಜಾಗದಲ್ಲಿ ಇಲ್ಲ. </p>
    <div class="limit-letter">
        <LetterComponenet letter={new Letter(undefined, "ಅ", "incorrect")}/>
    </div>
    <p>ಬೂದು ಬಣ್ಣದ ಅಕ್ಷರಗಳು ಪದದಲ್ಲಿಲ್ಲ. </p>
    <hr>
    <h1>Credits</h1>
    <div class="credits">
        <div class="dict">
            <div class="item">
                <p>ಮಾಡಿದ್ದು</p>
            </div>
            <div class="item">
                <a target="_blank" href="https://github.com/skandabhairava">Skanda M B</a>
            </div>
            <div class="item">
                <p>ಅನುವಾದಿಸಿದ್ದಾರೆ</p>
            </div>
            <div class="item">
                <a target="_blank" href="https://twitter.com/mandya_manju">Manjunath MN</a>
            </div>
            <div class="item">
                <p>ಸ್ಫೂರ್ತಿ</p>
            </div>
            <div class="item">
                <a target="_blank" href="https://wafflegame.net/">WaffleGame</a>
                <a target="_blank" href="https://www.nytimes.com/games/wordle/index.html">Wordle</a>
                <a target="_blank" href="https://wordalla.online/">Wordalla</a>
            </div>
            <div class="item">
                <p>ಮೂಲ ಕೋಡ್</p>
            </div>
            <div class="item">
                <a target="_blank" href="https://github.com/skandabhairava/Oxidised-Obbattu">Github</a>
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
        border-color: antiquewhite;
    }

    .main-popup {
        color: var(--font-color);

        /* display: flex;
        justify-content: center;
        align-items: center; */
        flex-grow: 1;
        overflow: hidden;
        flex-direction: column;

        font-size: large;
    }
</style>