<script>
    import { getContext } from 'svelte';
    import Popup from './HelpPopup.svelte';

    const { open } = getContext('simple-modal');
    const openPopup = () => open(Popup, { });
</script>
  
<button 
    class="help-button"
    on:click={openPopup}
>
    ?
</button>

<style>
    .help-button {
        margin-right: 5em;
        font-weight: bold;
        font-size: 21px;
    }

    @media (max-width: 700px) {
        .help-button {
            margin-right: 3em;
        }
    }
</style>
