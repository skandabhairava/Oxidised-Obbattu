<div class="header">
    <div class="spacer">
        <button class="help-button">
            ?
        </button>
    </div>
    <div class="title">
        <h1>ಒಬ್ಬಟ್ಟು</h1>
    </div>
    <div class="spacer">
        <button class="stats-button">
            <img src="./stats.png" alt="statistics" class="stats-img">
        </button>
    </div>
</div>

<style>

    .stats-img {
        width: 20px;
        filter: invert(100%);
    }
    
    .help-button, .stats-button {
        -webkit-padding: 0.4em 0;
        padding: 0.7em;
        padding-left: 1em;
        padding-right: 1em;
        font-size: large;
        border: 0;
        user-select: none;
        /* text-transform: uppercase; */
        border-radius: 5px;
        color: var(--font-color);
        background-color: rgb(65, 65, 65);

        -webkit-tap-highlight-color: transparent;

        cursor: pointer;
        box-shadow: 0 4px var(--incorrect-bg);
    }

    .help-button:hover, .stats-button:hover {
        background-color: rgb(57, 57, 57);
    }

    .help-button:active, .stats-button:active {
        box-shadow: 0 2px var(--popup-bg-color);
        transform: translateY(3px);
    }
    
    .help-button {
        margin-right: 5em;
        font-weight: bold;
        font-size: 21px;
    }

    .stats-button {
        margin-left: 5em;
    }

    
    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        /* border-bottom: 1px solid var(--border-color); */
    }
    
    .title {
        /* display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 0;
        margin-bottom: 0; */
        font-size: larger;
        font-weight: 500;
        letter-spacing: 5px;
    }
    
    
    .title>* {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    
    @media (max-width: 700px) {
        .help-button {
            margin-right: 3em;
        }

        .stats-button {
            margin-left: 3em;
        }
    }
</style>