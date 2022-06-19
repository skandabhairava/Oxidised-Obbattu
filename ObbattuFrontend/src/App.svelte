<script>
    import GameBoard from "./GameBoard.svelte";
    import Header from "./Header.svelte";

    import confetti from "canvas-confetti";

    const duration = 5 * 1000; //Fire work duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const questions = [["a", "d", "f", "t", "e"], ["o", "", "j", "", "h"], ["c", "r", "m", "p", "k"], ["w", "", "l", "", "b"], ["u", "x", "n", "v", "y"]]
    const ans_to_show = [["a", "b", "c", "d", "e"], ["f", "", "h", "", "j"], ["k", "l", "m", "n", "o"], ["p", "", "r", "", "t"], ["u", "v", "w", "x", "y"]]
    const answers = [["a", "b", "c", "d", "e"], ["e", "j", "o", "t", "y"], ["a", "f", "k", "p", "u"], ["u", "v", "w", "x", "y"], ["c", "h", "m", "r", "w"], ["k", "l", "m", "n", "o"]]
    const TOTAL_MOVES = 1

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function handleGameWin(e) {
        let animationEnd = Date.now() + duration;
        let interval = setInterval(function() {
            let timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            let particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }
        , 250);
    }

    function handleGameLost(e) {
    }

</script>

<main>
    <Header />
    <GameBoard 
        on:GAME_WON={handleGameWin} 
        on:GAME_LOST={handleGameLost} 
        questions={questions} 
        answers={answers} 
        ans_to_show={ans_to_show} 
        TOTAL_MOVES={TOTAL_MOVES}
    />
</main>

<style>
    main {
        width: 100%;
        max-width: var(--game-max-width);
        margin: 0 auto;
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

    /* .won, .lost {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
        color: white;
    }

    .won > button, .lost > button {
        padding: 18px;
        --clay-background: rgb(184, 247, 255);
        --clay-border-radius: 11px;
        --clay-border-radius: 1rem;
        --clay-shadow-outset: 4px 4px 8px 0 rgba(0,0,0,.25);
        --clay-shadow-inset-primary: -8px -8px 12px 0 rgba(0,0,0,.2);
        --clay-shadow-inset-secondary: 8px 8px 12px 0 hsla(0,0%,100%,.3);
        align-items: center;
        cursor: pointer;
        display: inline-flex;
        font-size: 24px;
        justify-content: center;
        line-height: 1;
        padding: 1.5rem 2rem;
        text-decoration: none;
        text-transform: uppercase;
        transition: all .15s ease;
        opacity: .8;
    }

    .won > button:hover, .lost > button:hover {
        opacity: 1;
    }

    .lost {
        background-color: #f76d6d;
    }

    .won {
        background-color: #24315e;
    }

    .title {
        color: var(--color-white);
        font-size: 88px;
        line-height: 1;
        margin-bottom: 4rem;
        text-shadow: 0 0.075em rgb(0 0 0 / 25%);
    } */
</style>