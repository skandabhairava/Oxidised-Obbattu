<script>

    import { toast } from '@zerodevx/svelte-toast'

    export let toastId

    function refreshPage() {
        toast.pop(toastId)
    }
</script>
    
<div class="main">
    <h3>New Obbattu Has been served</h3>
    <button class="buttn" on:click={refreshPage}>Refresh</button>
</div>

<style>
    .main{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .buttn {
        background-color: var(--correct-bg);
        color: var(--guessed-letter-color);
        -webkit-padding: 0.4em 0;
        padding: 0.5em;
        padding-left: 0.75em;
        padding-right: 0.75em;
        font-size: small;
        border: 0;
        user-select: none;
        text-transform: uppercase;
        /* margin: 0 0 0.5em 0; */
    }

    .buttn:hover {
        background-color: var(--correct-shadow);
        cursor: pointer;
    }
</style>