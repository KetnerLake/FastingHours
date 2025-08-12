<script>
  let {duration = 0, now = null, started = null} = $props();

  let tick = $derived.by( () => {
    if( started === null ) {
      return {
        hours: 0,
        minutes: '00',
        seconds: '00'
      };
    }

    let difference = Math.floor( ( now - started.getTime() ) / 1000 );

    if( duration !== 0 ) {
      const future = new Date( started.getTime() + ( duration * 3600000 ) );
      difference = Math.floor( ( future.getTime() - now ) / 1000 );
    }
    
    return {
      hours: Math.floor( difference / 3600 ).toString( 10 ).padStart( 2, '0' ),
      minutes: Math.floor( ( difference % 3600 ) / 60 ).toString( 10 ).padStart( 2, '0' ),
      seconds: ( difference % 60 ).toString( 10 ).padStart( 2, '0' ) 
    };
  } );
</script>

<article>
  <p>
    <span>{tick.hours}</span>
    <span class="units">hrs</span>
  </p>
  <p class="colon">:</p>
  <p>
    <span>{tick.minutes}</span>
    <span class="units">min</span>
  </p>  
  <p class="colon">:</p>  
  <p>
    <span>{tick.seconds}</span>
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
