<script>
    import GameBoard from "./GameBoard/GameBoard.svelte";
    import Header from "./Header.svelte";

    import { SvelteToast } from '@zerodevx/svelte-toast';
    import { toast } from '@zerodevx/svelte-toast';
    import RefreshNotif from "./RefreshNotif.svelte";

    import Countdown from "./Countdown.svelte";

    import confetti from "canvas-confetti";

    const duration = 5 * 1000; //Fire work duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    //let questions
    let questions = [["a", "d", "f", "t", "e"], ["o", "", "j", "", "h"], ["c", "r", "m", "p", "k"], ["w", "", "l", "", "b"], ["u", "x", "n", "v", "y"]]
    let ans_to_show = [["a", "b", "c", "d", "e"], ["f", "", "h", "", "j"], ["k", "l", "m", "n", "o"], ["p", "", "r", "", "t"], ["u", "v", "w", "x", "y"]]
    let answers = [["a", "b", "c", "d", "e"], ["e", "j", "o", "t", "y"], ["a", "f", "k", "p", "u"], ["u", "v", "w", "x", "y"], ["c", "h", "m", "r", "w"], ["k", "l", "m", "n", "o"]]
    let TOTAL_MOVES = 2

    $: show_loading = (questions === undefined || ans_to_show === undefined || answers === undefined)? true:false

    let show_timer = null // to show if timer or alert should be displayed

    // SET RESFRESH TIME HERE!
    const refreshTime = {
        hour: 23,
        min: 59,
        sec: 59,
    }

    function getDurationTillMidnight(duration = true) {
        let end_time = new Date()
        end_time.setHours(refreshTime.hour, refreshTime.min, refreshTime.sec)
        
        let now = new Date()
        let dur = end_time - now

        //return dur

        if (dur < 0) {
            end_time.setDate(end_time.getDate() + 1)
            dur = Math.abs(end_time - now)// + 86400000
        }

        //console.log(dur)
        if (duration === true) {
            return dur
        } else {
            return end_time
        }
    }

    function refreshAlertCheck() {
        if (show_timer === null) {
            displayRefreshToast()
        }
    }
    
    let refreshTimeout = setTimeout(
        refreshAlertCheck,
        getDurationTillMidnight()
    )

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function incrementWonStat() {
        let obj = window.localStorage.getItem("GAME_STATS")
        let json

        if (obj === null) {
            json = {
                GAMES_PLAYED: 0,
                GAMES_WON: 0
            }
        } else {
            json = JSON.parse(obj)
        }
        
        json.GAMES_WON += 1
        json.GAMES_PLAYED += 1

        window.localStorage.setItem("GAME_STATS", JSON.stringify(json))
    }

    function incrementPlayedStat() {
        let obj = window.localStorage.getItem("GAME_STATS")
        let json

        if (obj === null) {
            json = {
                GAMES_PLAYED: 0,
                GAMES_WON: 0
            }
        } else {
            json = JSON.parse(obj)
        }
        
        json.GAMES_PLAYED += 1

        window.localStorage.setItem("GAME_STATS", JSON.stringify(json))
    }

    function handleGameWin(e) {
        let animationEnd = Date.now() + duration;

        navigator.vibrate(200)
        incrementWonStat()
        if (show_timer === null) {
            show_timer = "timer"
        }

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
        incrementPlayedStat()
        if (show_timer === null) {
            show_timer = "timer"
        }
    }

    function refreshBoard(_) {
        console.log("refreshing board....")

        refreshTimeout = setTimeout(
            refreshAlertCheck,
            getDurationTillMidnight()
        )
    }

    function displayRefreshToast() {
        toast.push({
        component: {
            src: RefreshNotif, // where `src` is a Svelte component
            sendIdTo: 'toastId' // send toast id to `toastId` prop
        },
        dismissable: true,
        initial: 0,
        onpop: refreshBoard
        /* theme: {
            '--toastPadding': '0',
            '--toastMsgPadding': '1em'
        } */
        })
    }

</script>

<main>
    <Header />
    {#if show_loading === false}
        <GameBoard 
            on:GAME_WON={handleGameWin} 
            on:GAME_LOST={handleGameLost} 
            questions={questions} 
            answers={answers} 
            ans_to_show={ans_to_show} 
            TOTAL_MOVES={TOTAL_MOVES}
        />
        <div class="timer">
            {#if show_timer === "timer"}
                <Countdown endDate={getDurationTillMidnight} finishMsg="Refresh the page manually"/>
            {/if}
        </div>
    {:else}
        <div class="notice">
            <h1>Generating a new game...</h1>
            <h3>Please wait...</h3>
            <div class="loadingio"><div class="ldio">
                <div></div><div></div><div></div><div></div>
            </div></div>
        </div>
    {/if}
</main>
<SvelteToast />

<style>
    main {
        width: 100%;
        max-width: var(--game-max-width);
        margin: 0 auto;
        height: 100%;
        display: flex;
        flex-direction: column;

        align-items: center;
    }

    @media (min-width: 640px) {
        main {
            max-width: none;
        }
    }

    .notice{
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        flex-direction: column;
    }

    h1{

        margin-top: 5em;
        
        font-size: x-large;
        font-weight: bold;
        letter-spacing: 5px;
    }

    @keyframes ldio {
        0% { transform: scale(1.1) }
        100% { transform: scale(1) }
    }
    .ldio div {
        position: absolute;
        width: 62.22px;
        height: 62.22px;
        top: 19.519999999999996px;
        left: 19.519999999999996px;
        background: #3a8b38;
        animation: ldio 0.970873786407767s cubic-bezier(0,0.5,0.5,1) infinite;
        animation-delay: -0.2912621359223301s;
    }
    .ldio div:nth-child(2) {
        top: 19.519999999999996px;
        left: 101.25999999999999px;
        background: #e29825;
        animation-delay: -0.1941747572815534s;
    }
    .ldio div:nth-child(3) {
        top: 101.25999999999999px;
        left: 19.519999999999996px;
        background: #ffffff;
        animation-delay: 0s;
    }
    .ldio div:nth-child(4) {
        top: 101.25999999999999px;
        left: 101.25999999999999px;
        background: #323434;
        animation-delay: -0.0970873786407767s;
    }
    .loadingio {
        width: 183px;
        height: 183px;
        display: inline-block;
        overflow: hidden;
        background: none;
    }
    .ldio {
        width: 100%;
        height: 100%;
        position: relative;
        transform: translateZ(0) scale(1);
        backface-visibility: hidden;
        transform-origin: 0 0; /* see note above */
    }
    .ldio div { box-sizing: content-box; }
    /* generated by https://loading.io/ */
</style>