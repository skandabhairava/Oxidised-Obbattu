<script>

    // import {saveObject, getObject} from "../../storage.js";

    let GAMES_PLAYED = 0
    let GAMES_WON = 0

    let deleted = false

    $: GAMES_LOST = GAMES_PLAYED - GAMES_WON

    function trash() {
        window.localStorage.removeItem("GAME_STATS")
        GAMES_PLAYED = 0
        GAMES_WON = 0

        deleted = true
    }

    function saveObject(key, obj) {
        window.localStorage.setItem(key, JSON.stringify(obj))
    }

    function getObj(key) {
        // console.log("Shits going on...")
        try {
            let json = JSON.parse(window.localStorage.getItem(key))
            // console.log("found item", json)
            return json
        } catch {
            return null
        }
    }

    let game_stats = getObj("GAME_STATS")
    // console.log("found stats", game_stats)
    function load() {
        if (game_stats === null) {
            game_stats = {
                GAMES_PLAYED: 0,
                GAMES_WON: 0
            }

            saveObject("GAME_STATS", game_stats)
        } else {
            GAMES_PLAYED = game_stats.GAMES_PLAYED,
            GAMES_WON = game_stats.GAMES_WON
        }
    }

    load()
</script>

<div class="main-popup">
    <h1>Statistics</h1>
    <hr>
    <div class="dict">
        <div class="item left">
            <p>Played</p>
        </div>
        <div class="item right">
            <p>{GAMES_PLAYED}</p>
        </div>
        <div class="item left">
            <p>Games Won</p>
        </div>
        <div class="item right">
            <p>{GAMES_WON}</p>
        </div>
        <div class="item left">
            <p>Games Lost</p>
        </div>
        <div class="item right">
            <p>{GAMES_LOST}</p>
        </div>
    </div>
    <hr>
    <div
        style="display: {(deleted === true)?"none":"block"};"
    >
        <button
            on:click={trash}
            class="trash"
        >
            <img src="./trash.png" alt="delete stats" class="trash-img">
            <h1>Delete Stats</h1>
        </button>
    </div>
    <div
        style="display: {(deleted === false)?"none":"block"};"
    >
    <h3>Re-open the popup to enable statistics</h3>
    </div>
</div>

<style>
    h1 {
        font-size: x-large;
        font-weight: bold;
        letter-spacing: 5px;
    }

    .trash {
        display: flex;
        justify-content: center;
        align-items: center;

        margin-top: 2em;
        background-color: var(--correct-bg);
        color: var(--guessed-letter-color);
        /* -webkit-padding: 0.4em 0;
        padding: 1em; */
        padding-left: 1.75em;
        padding-right: 1.75em;

        border: 0;
        user-select: none;
        text-transform: uppercase;

        /* flex-direction: row; */
    }

    @media (max-width: 700px) {
        .dict {
            grid-template-columns: 50% 50%;
        }

        .trash-img {
            display: none;
        }
    }

    .trash:hover {
        background-color: var(--correct-shadow);
        cursor: pointer;
    }

    .trash-img {
        width: 20px;
        margin-right: 10px;
        /* filter: invert(100%); */
    }

    .dict {
        margin-top: 10px;
        margin-bottom: 10px;

        justify-content: center;
        align-items: center;

        display: grid;
        grid-template-columns: 100% 100%;

        width: 100%;
    }

    hr {
        width: 100%;
        color: antiquewhite;
    }

    .item {
        border: 1px solid rgb(88, 88, 88);
        padding-left: 20px;
        padding-right: 20px;
        /* width: 100%; */
    }

    .left {
        background-color: rgb(67, 67, 67);
        text-align: right;
    }

    .main-popup {
        color: var(--font-color);

        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        overflow: hidden;
        flex-direction: column;
    }
</style>