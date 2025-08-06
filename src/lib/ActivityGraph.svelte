<script>
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  let {average = [], daily = null, days = 10} = $props(); 

  let sunrise = $state( null );
  let sunset = $state( null );

  let icon = $derived.by( () => {
    if( sunset === null ) return null;

    if( sunset.getTime() < Date.now() ) {
      return 'material-symbols:moon-stars-outline-rounded';
    } else {
      return 'material-symbols:wb-sunny-outline-rounded';      
    }
  } );

  onMount( () => {
    navigator.geolocation.getCurrentPosition( ( position ) => {
      fetch( `https://api.sunrise-sunset.org/json?lat=${position.latitude}&lng=${position.longitude}&date=today` )
      .then( ( response ) => response.json() )
      .then( ( data ) => {
        sunrise = parseTime( data.results.sunrise );
        sunset = parseTime( data.results.sunset );        

        if( Date.now() > sunset.getTime() ) {
          fetch( `https://api.sunrise-sunset.org/json?lat=${position.latitude}&lng=${position.longitude}&date=tomorrow` )          
          .then( ( response ) => response.json() )
          .then( ( data ) => {
            sunrise = parseTime( data.results.sunrise );
            sunset = parseTime( data.results.sunset );        
          } );
        }
      } );
    }, ( err ) => {
      console.log( err );
    } );
  } );

  function parseTime( value ) {
    const parts = value.match(/(\d+):(\d+):(\d+)\s*(AM|PM)/i);

    let hours = parseInt( parts[1], 10 );
    const minutes = parseInt( parts[2], 10 );
    const seconds = parseInt( parts[3], 10 );    
    const ampm = parts[4].toUpperCase();

    if( ampm === 'PM' && hours !== 12 ) {
      hours += 12;
    } else if( ampm === 'AM' && hours === 12 ) {
      hours = 0;
    }

    const date = new Date();
    date.setHours( hours, minutes, seconds, 0 );

    return date;
  }

  function formatLabel( value ) {
    value = new Date( value + 'T00:00:00' );

    const formatter = new Intl.DateTimeFormat( navigator.language, {
      month: 'short',
      day: 'numeric'
    } );    
    return formatter.format( value );
  }

  function formatTime( value ) {
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      hour: 'numeric',
      minute: '2-digit'
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
    {#if icon !== null}
      <div class="daynight">
        <Icon height="16" icon={icon} width="16" />
        <p class="daynight">
          <a href="https://sunrise-sunset.org" target="_blank">{formatTime( sunrise )}</a>
        </p>
      </div>
    {/if}   
    <div class="color"></div>
    <p>Fasting</p>
  </legend>

</figure>

<style>
  a {
    color: #0284c7;
    cursor: pointer;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }
  
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

  legend div.color {
    background: #52525b;
    border-radius: 3px;
    box-sizing: border-box;
    display: inline;
    min-height: 16px;
    min-width: 16px;
  }

  legend div.daynight {
    align-items: center;
    display: flex;
    flex-basis: 0;
    flex-direction: row;
    flex-grow: 1;
    gap: 6px;
    padding: 0 0 0 66px;
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
