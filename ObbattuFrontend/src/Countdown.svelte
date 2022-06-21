<script>
    export let endDate
    export let finishMsg

    console.log(endDate(false))
    endDate = endDate()
    console.log(endDate)

    $: hr = Math.floor((endDate / (1000 * 60 * 60)) % 24)
    $: min = Math.floor(Math.abs((endDate / (1000 * 60)) % 60))
    $: sec = Math.floor(Math.abs((endDate / 1000) % 60))

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
                return
            } else {
                hr = Math.abs(hrss)
                min = minss
                sec = secss
            }
        },
        1000
    )
</script>

<div class=timer>
    {#if finished === false}
        {hr}hrs {min}mins {sec}secs
    {:else}
        {finishMsg}
    {/if}
</div>