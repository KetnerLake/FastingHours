<script>
  let {average = [], daily = null, days = 10} = $props(); 

  // TODO: Add sunrise and sunset for Ramadan?
  // https://api.sunrise-sunset.org/json?lat=39.497222&lng=-104.765833&date=today
  // let sunset = new Date( Date.UTC( 2025, 7, 5, 2, 8, 34 ) );

  function formatLabel( value ) {
    value = new Date( value + 'T00:00:00' );

    const formatter = new Intl.DateTimeFormat( navigator.language, {
      month: 'short',
      day: 'numeric'
    } );    
    return formatter.format( value );
  }

  function offset( hour, status ) {
    if( hour === 0 || status[hour - 1] === 0 ) {
      return ( ( 1 - status[hour] ) * 100 ) + '%';
    }

    return 0;
  }
</script>

<figure>

  <div class="labels">
    <p class="date">Date</p>
    <p class="hour">0</p>
    <p class="hour">12</p>
    <p class="hour">24</p>
  </div>    

  <div class="grid">
    {#if daily !== null}
      {#each Object.keys( daily ) as day}
        {@const status = daily[day]}        
        <p class="day">{formatLabel( day )}</p>
        {#each {length: 24}, hour}
          <div class="day">
            {#if status[hour] !== 0}
              <div 
                class="hour" 
                style:margin-left={offset( hour, status )} 
                style:width={( 100 * status[hour] ) + '%'}>
              </div>          
            {/if}          
          </div>
        {/each}
      {/each}
    {/if}
  </div>

  <div class="average grid">
    <p class="day">Avg</p>
    {#each {length: 24}, hour}      
      <div class="day">
        <div 
          class="hour" 
          style:opacity={average[hour]} 
          style:width="100%">
        </div>
      </div>      
    {/each}      
  </div>

  <legend>
    <!--
    <Icon height="16" icon="material-symbols:wb-sunny-outline-rounded" width="16" />
    <p>Aug 5 @ 12:34 PM</p>
    <Icon height="16" icon="material-symbols:moon-stars-outline-rounded" width="16" />    
    <p>Aug 5 @ 12:34 PM</p>    
    -->    
    <div></div>
    <p>Fasting</p>
  </legend>

</figure>

<style>
  div.day {
    background: #00000010;
    border-radius: 3px;
    box-sizing: border-box;
    flex-basis: 0;
    flex-grow: 1;
    height: 24px;
    overflow: hidden;
  }  

  div.grid {
    box-sizing: border-box;
    display: grid;
    gap: 2px;
    grid-template-columns: 62px repeat( 24, 1fr );    
    width: 100%;    
  }

  div.average.grid {
    padding: 8px 0 0 0;
  }

  div.hour {
    background: #52525b;
    height: 24px;
    margin: 0;
  }

  div.labels {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 62px repeat( 3, 1fr );    
    padding: 0 0 2px 0;
    width: 100%;    
  }  

  figure {
    align-self: center;
    box-sizing: border-box;
    margin: 0;
    max-width: 660px;
    min-width: 330px;
    padding: 16px;
    width: 100%;
  }

  legend {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-end;
    margin: 0;
    padding: 8px 4px 0 0;
    width: 100%;
  }

  legend p {
    box-sizing: border-box;
    color: #161616;
    cursor: defaut;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 0;
  }

  legend div {
    background: #52525b;
    border-radius: 3px;
    box-sizing: border-box;
    display: inline;
    min-height: 16px;
    min-width: 16px;
  }

  p.day {
    box-sizing: border-box;
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 2px 0 2px 0;
    white-space: nowrap;
  }

  p.hour,
  p.date {
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
    width: 62px;
  }  

  p.date {
    text-align: left;
  }

  p.hour:nth-of-type( 2 ) {
    padding: 0 0 0 2px;
  }

  p.hour:nth-of-type( 3 ) {
    justify-self: center;
    text-align: center;
  }

  p.hour:last-of-type {
    justify-self: end;
    padding: 0 4px 0 0;
    text-align: right;
  }
</style>
