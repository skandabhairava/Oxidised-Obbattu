<script>
    import Letter from './Letter.svelte';
    import { dndzone, TRIGGERS } from 'svelte-dnd-action';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let letter;
    export let xPos;
    export let yPos

    let items = [letter];
    function handleDndConsider(e) {
		items = e.detail.items;
	}

    function handleDndFinalize(e) {

        const {info: {trigger}} = e.detail

		if (trigger === TRIGGERS.DROPPED_INTO_ANOTHER) {
			//console.log(`DROPPED_INTO_ANOTHER from ${xPos}, ${yPos}`); //starting container
            //console.log(e)

            dispatch('DRAGGED_FROM', {
                type: "DRAGGED_FROM",
			    text: 'Item has been dragged from x, y',
                xPos: xPos,
                yPos: yPos
		    });
		}

        if (items.length != e.detail.items) {
            dispatch('DRAGGED_TO', {
                type: "DRAGGED_TO",
			    text: 'Item has been dragged to x, y',
                xPos: xPos,
                yPos: yPos
		    });
        }

        items = e.detail.items;
	}

    $: options = {
		dropFromOthersDisabled: ((letter.state === "blocked") || (letter.state === "correct")),
        dragDisabled: ((letter.state === "blocked") || (letter.state === "correct")),
		items,
		dropTargetStyle: {},
		flipDurationMs: 100
	};
</script>

<div 
    class="letter"
    use:dndzone={options} 
    on:consider={handleDndConsider} 
    on:finalize={handleDndFinalize}
    on:click={
        () => {
            console.log(xPos, yPos, letter.letter)
        }
    }
    >
    {#each items as tile(tile.id)}
        <Letter letter={tile}/>
    {/each}
</div>

<style>
    .letter {
        font-size: 2rem;
        display: inline-flex;
        font-weight: bold;
        vertical-align: middle;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        user-select: none;
        line-height: 2rem;
        text-transform: uppercase;
    }
</style>