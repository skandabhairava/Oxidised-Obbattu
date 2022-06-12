<script>
    import LetterContainer from './LetterContainer/LetterContainer.svelte';
    export let row_list;
    export let col;

	const flipDurationMs = 150;
</script>

<div class="row">
    {#each row_list as letter, i (letter.id)}
        <LetterContainer letter={letter} xPos={i} yPos={col} on:DRAGGED_FROM on:DRAGGED_TO/>
    {/each}
</div>

<style>
    .row {
        /* display: grid;
        grid-template-columns: repeat(5, 1fr); */
        grid-gap: 5px;
        display: flex ;
		flex-direction: row;
		justify-content: center;
    }
</style>