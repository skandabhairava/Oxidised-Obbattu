<script>
    import { getContext } from 'svelte';
    import Popup from './SolPopup.svelte';

    export let board;

    const { open } = getContext('simple-modal');
    const openPopup = () => open(Popup, { board });
</script>
  
<button 
    on:click={openPopup}
    class="show-sol-button"
>
    show solution
</button>

<style>
    .show-sol-button {
        margin-top: 2em;
        background-color: var(--correct-bg);
        color: var(--guessed-letter-color);
        -webkit-padding: 0.4em 0;
        padding: 1em;
        padding-left: 1.75em;
        padding-right: 1.75em;
        font-size: large;
        border: 0;
        user-select: none;
        text-transform: uppercase;
        /* margin: 0 0 0.5em 0; */
    }

    .show-sol-button:hover {
        background-color: var(--correct-shadow);
        cursor: pointer;
    }
</style>