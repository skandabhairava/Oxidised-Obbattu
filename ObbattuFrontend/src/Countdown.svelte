<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let endDate
    export let finishMsg
    
    //console.log(endDate(false))
    endDate = endDate()
    //console.log(endDate)

    $: hr = (Math.floor((endDate / (1000 * 60 * 60)) % 24)).toString()
    $: min = (Math.floor(Math.abs((endDate / (1000 * 60)) % 60))).toString()
    $: sec = (Math.floor(Math.abs((endDate / 1000) % 60))).toString()

    let finished = false

    let x = setInterval(
        () => {
            
            endDate -= 1000

            let hrss = Math.floor((endDate / (1000 * 60 * 60)) % 24)
            let minss = Math.floor(Math.abs((endDate / (1000 * 60)) % 60))
            let secss = Math.floor(Math.abs((endDate / 1000) % 60))

            if (endDate <= 0) {
                clearInterval(x)
                finished = true

                dispatch("REFRESH_BOARD")

                return
            } else {
                hr = (Math.abs(hrss)).toString()
                min = minss.toString()
                sec = secss.toString()
            }
        },
        1000
    )
</script>

<div class=timer>
    {#if finished === false}
        {(hr.length === 1)? "0": ""}{hr}:{(min.length === 1)? "0": ""}{min}:{(sec.length === 1)? "0": ""}{sec}
    {:else}
        {finishMsg}
    {/if}
</div>

<style>
</style>