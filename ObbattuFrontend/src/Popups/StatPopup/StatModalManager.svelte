<script>
    import { getContext } from 'svelte';
    import Popup from './StatPopup.svelte';

    const { open } = getContext('simple-modal');
    const openPopup = () => open(Popup, { });
</script>
  
<button 
    class="stats-button"
    on:click={openPopup}
>
    <img src="./stats.png" alt="statistics" class="stats-img">
</button>

<style>
    .stats-img {
        width: 20px;
        filter: invert(100%);
    }

    .stats-button {
        margin-left: 5em;
    }

    @media (max-width: 700px) {
        .stats-button {
            margin-left: 3em;
        }
    }
</style>
