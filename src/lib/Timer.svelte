<script>
  import {onMount} from "svelte";

  let {now = null, started = null} = $props();

  let duration = $derived.by( () => {
    if( now === null || started === null ) {
      return {
        hours: 0,
        minutes: '00',
        seconds: '00'
      };
    }

    const difference = Math.floor( ( now - started.getTime() ) / 1000 );
    
    return {
      hours: Math.floor( difference / 3600 ).toString( 10 ).padStart( 2, '0' ),
      minutes: Math.floor( ( difference % 3600 ) / 60 ).toString( 10 ).padStart( 2, '0' ),
      seconds: ( difference % 60 ).toString( 10 ).padStart( 2, '0' ) 
    };
  } );
</script>

<article>
  <p>
    <span>{duration.hours}</span>
    <span class="units">hrs</span>
  </p>
  <p class="colon">:</p>
  <p>
    <span>{duration.minutes}</span>
    <span class="units">min</span>
  </p>  
  <p class="colon">:</p>  
  <p>
    <span>{duration.seconds}</span>
    <span class="units">sec</span>
  </p>
</article>

<style>
  article {
    display: flex;
    flex-direction: row;
  }

  p {
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 48px;
    font-weight: 600;
    letter-spacing: 0.10px;
    line-height: 48px;
    margin: 0;
    padding: 0;
    text-align: right;
  }

  p.colon {
    padding: 0 8px 0 8px;
  }  

  p span {
    display: block;
  }

  p span.units {
    display: block;
    font-size: 20px;
    line-height: 20px;
  }  
</style>
