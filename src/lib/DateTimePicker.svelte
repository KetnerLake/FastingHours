<script>
  import Calendar from "./Calendar.svelte";
  import Clock from "./Clock.svelte";

  let {label, onchange, value = new Date()} = $props();

  let view = $state( 'calendar' );

  function formatDate( value ) {
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

  function onCalendarChange( selected ) {
    selected.setHours( value.getHours() );
    selected.setMinutes( value.getMinutes() );
    selected.setSeconds( value.getSeconds() );

    value = new Date( selected.getTime() );
    if( onchange ) onchange( value );
  }

  function onCalendarClick() {
    view = 'calendar';    
  }

  function onClockChange( selected ) {
    selected.setFullYear( value.getFullYear() );
    selected.getMonth( value.getMonth() );
    selected.getDate( value.getDate() );

    value = new Date( selected.getTime() );
    if( onchange ) onchange( value );
  }

  function onClockClick() {
    view = 'clock';
  }
</script>

<article>
  <header>
    <button class:selected={view === 'calendar' ? true : false} onclick={onCalendarClick} type="button">
      <p>{label}</p>
      <p>{formatDate( value )}</p>
    </button>
    <button class:selected={view === 'clock' ? true : false} onclick={onClockClick} type="button">
      <p>{formatTime( value )}</p>
    </button>
  </header>
  {#if view === null || view === 'calendar'}
    <Calendar onchange={onCalendarChange} {value} />
  {:else}
    <Clock onchange={onClockChange} {value} />
  {/if}
</article>

<style>
  article {
    background: #ffffff;
    border-radius: 4px;
    padding: 0 0 4px 0;
  }

  header {
    align-items: center;
    border-bottom: solid 1px #00000010;    
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 8px;
    height: 40px;
    list-style: none;
    margin: 0 0 4px 0;
    outline: none;
    padding: 0;
  }

  header button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-family: 'Roboto Variable';
    font-size: 12px;
    font-weight: 400;
    height: 40px;
    letter-spacing: 0.10px;
    line-height: 28px;    
    margin: 0;
    outline: none;
    padding: 0;
    transition: 
      color 0.15s ease-in-out
      background 0.15s ease-in-out;
    -webkit-tap-highlight-color: transparent;    
  }

  header button:first-of-type {
    flex-basis: 0;
    flex-grow: 1;
    padding: 0 0 0 12px;
  }

  header button:last-of-type {  
    padding: 0 5px 0 0;
  }

  header p {
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    font-family: 'Roboto Variable';
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }

  header button p:first-of-type {
    flex-basis: 0;
    flex-grow: 1;    
    text-align: left;
  }

  header button p:last-of-type {
    background: transparent;    
    border: solid 1px #00000040;
    border-radius: 4px;
    font-size: 12px;
    line-height: 28px;
    padding: 0 12px 0 12px;
    transition: 
      background 0.30s ease-in-out,
      border 0.30s ease-in-out,
      color 0.30s ease-in-out;    
  }

  header button.selected p:last-of-type {
    color: #0284c7;
    background: #00000010;
    border: solid 1px #0284c7;
  }
</style>
