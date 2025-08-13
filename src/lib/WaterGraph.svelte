<script>
  let {average = 0, daily = []} = $props();

  let maximum = $derived( daily.reduce( ( previous, current ) => {
    previous = current.volume > previous ? current.volume : previous;
    return previous;
  }, 0 ) );

  let stops = $derived.by( () => {
    const top = Math.floor( maximum + ( maximum * 0.10 ) );
    return [
      0,
      Math.round( top / 4 ) * 1,
      Math.round( top / 4 ) * 2,      
      Math.round( top / 4 ) * 3,      
      top
    ];
  } );

  function formatDate( value ) {
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      month: 'short',
      day: 'numeric'
    } );
    return formatter.format( value );
  }
</script>

<figure>
  <div class="labels">
    {#if maximum === 0}
      <p>0</p>
    {:else}
      {#each stops as stop}
        {@const ounces = stop === 0 ? '0' : stop + ' oz'}
        <p>{ounces}</p>        
      {/each}
    {/if}
  </div>  
  <div class="chart">
    <div class="labels">
      {#each daily as day}
        <p>{formatDate( day.created )}</p>
      {/each} 
    </div>
    <div class="columns">
      {#if maximum !== 0}      
        {#each daily as day}
          <div class="column" style:width="{( day.volume / Math.floor( maximum + ( maximum * 0.10 ) ) ) * 100}%">
            <p>{day.volume} oz</p>
          </div>
        {/each}
      {/if}
      {#each {length: 4}, stop}
        <div class="line" data-value={stop} style:left="{25 * ( stop + 1 )}%"></div>
      {/each}
      {#if average > 0}
        <div class="average" data-value={average} style:left="{( average / Math.floor( maximum + ( maximum * 0.10 ) ) ) * 100}%"></div>            
      {/if}
    </div>    
  </div>
</figure>

<style>
  figure {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 242px;
    margin: 0;
    max-width: 660px;
    min-width: 330px;    
    padding: 4px;
    width: 100%;
  }

  figure > div.labels {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 0 2px 62px;
  }

  figure > div.labels p {
    box-sizing: border-box;
    color: #00000040;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 0;    
    text-align: center;
  }

  figure > div.labels p {
    transform: translateX( 50% );
  }

  figure > div.labels p:nth-of-type( 2 ) {
    transform: translateX( calc( 50% - 8px ) );
  }
  
  figure > div.labels p:nth-of-type( 3 ) {
    transform: translateX( calc( 50% - 2px ) );
  }

  figure > div.labels p:nth-of-type( 4 ) {
    transform: translateX( calc( 50% + 2px ) );
  }  

  figure > div.labels p:first-of-type {
    padding-left: 0;
    transform: unset;
  }  

  figure > div.labels p:last-of-type {
    padding-right: 0;
    transform: unset;
  }  

  div.chart {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 100%;
  }

  div.chart > div.labels {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    margin: 0;
    padding: 0;
  }

  div.chart > div.labels p {
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    padding: 0;
    text-align: left;
    width: 62px;
  }

  div.column {
    background: #52525b;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;    
    box-sizing: border-box;
    height: 24px;
    transition: width 0.30s ease-in-out;
  }

  div.column p {
    color: #ffffff;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 2px 0 2px 0;
    text-align: center;
  }

  div.columns {
    border-left: solid 1px #00000040;    
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    justify-content: space-evenly;
    padding: 0;
    position: relative;
  }

  div.average {
    border-right: dashed 2px #0284c7;
    box-sizing: border-box;
    height: 100%;
    position: absolute;
    width: 1px;
    z-index: 10;
  }

  div.line {
    border-right: dashed 1px #00000040;
    box-sizing: border-box;
    height: 100%;
    position: absolute;
    width: 1px;
    z-index: -10;
  }  
</style>