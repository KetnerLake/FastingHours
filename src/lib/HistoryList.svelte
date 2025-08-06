<script>
  let {items = [], onchange} = $props();

  function formatDate( value ) {
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    } );    
    return formatter.format( value );
  }

  function formatDuration( start, end ) {
    const difference = end.getTime() - start.getTime();
    const seconds = Math.floor( difference / 1000 );
    const hours = Math.floor( seconds / 3600 );
    const minutes = Math.floor( ( seconds % 3600 ) / 60 );

    const formatter = new Intl.DurationFormat( navigator.language, {
      style: 'short',
      units: ['hour', 'minute'],
    } );
    return formatter.format( {hours, minutes} );
  }

  function formatHeader( value ) {
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      weekday: 'long',
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

  function onItemClick( source, id ) {
    if( onchange ) onchange( source, id );
  }
</script>

{#if items.length === 0}
  <article>
    <p>Your fasting history<br>will be displayed here.</p>
  </article>
{:else}
  <ul>
    {#each items as item}
      {#if item.type === 'header'}
        <li class="header">
            <p>{formatHeader( item.timed )}</p>
        </li>
      {:else}
        <li>
          <button onclick={() => onItemClick( item.type, item.id )} type="button">
            {#if item.type === 'start'}
              <p>Started Fast</p>
              <p></p>
              <p>{formatDate( item.timed )}</p>
              <p>{formatTime( item.timed )}</p>
            {:else if item.type === 'water'}
              <p>Water</p>
              <p>{item.volume} oz</p>
              <p>{formatDate( item.timed )}</p>
              <p>{formatTime( item.timed )}</p>
            {:else if item.type === 'hunger'}
              <p>{item.level}</p>
              <p></p>
              <p>{formatDate( item.timed )}</p>
              <p>{formatTime( item.timed )}</p>        
            {:else if item.type === 'end'}
              <p>Ended Fast</p>
              <p>{formatDuration( item.started, item.ended )}</p>
              <p>{formatDate( item.timed )}</p>
              <p>{formatTime( item.timed )}</p>                      
            {/if}
          </button>
        </li>
      {/if} 
    {/each}
  </ul>
{/if}

<style>
  article {
    align-items: center;
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    justify-content: center;
  }

  article p {
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 24px;
    text-align: center;
  }

  ul {
    list-style: none;
    margin: 0 0 -1px 0;
    padding: 0;
  }

  li {
    border-bottom: solid 1px #00000010;
  }

  li.header {
    background: #f4f4f4;
    border: none;
    padding: 2px 0 2px 16px;
    position: sticky;
    text-transform: uppercase;
    top: 0;
    z-index: 25;
  }

  li.header p {
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }

  li button {
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 0;
    outline: none;
    padding: 5px 16px 5px 16px;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  li button p {
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }

  li button p:nth-of-type( 1 ),
  li button p:nth-of-type( 3 ) {
    text-align: left;
  }

  li button p:nth-of-type( 1 ) {
    font-weight: 500;
  }  

  li button p:nth-of-type( 3 ) {
    font-size: 14px;
    line-height: 20px;
    opacity: 0.60;
  }  

  li button p:nth-of-type( 2 ),
  li button p:nth-of-type( 4 ) {
    text-align: right;
  }  

  li button p:nth-of-type( 4 ) {
    font-size: 14px;
    line-height: 20px;
    opacity: 0.60;
  }    
</style>
