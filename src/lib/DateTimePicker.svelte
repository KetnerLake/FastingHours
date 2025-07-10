<script>
  import Calendar from "./Calendar.svelte";
  import Clock from "./Clock.svelte";

  let {label, onchange, value = new Date()} = $props();

  let open = $state( false );
  let view = $state( null );

  let date = $derived.by( () => {
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      month: 'short',
      day: 'numeric'
    } );
    return formatter.format( value );
  } );
  let time = $derived.by( () => {
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      hour: 'numeric',
      minute: '2-digit'
    } );
    return formatter.format( value );
  } );

  function onCalendarChange( selected ) {
    selected.setHours( value.getHours() );
    selected.setMinutes( value.getMinutes() );
    selected.setSeconds( value.getSeconds() );

    value = new Date( selected.getTime() );
    if( onchange ) onchange( value );
  }

  function onCalendarClick() {
    open = view === 'calendar' ? false : true;    
    view = open ? 'calendar' : null;
  }

  function onClockChange( selected ) {
    selected.setFullYear( value.getFullYear() );
    selected.getMonth( value.getMonth() );
    selected.getDate( value.getDate() );

    value = new Date( selected.getTime() );
    if( onchange ) onchange( value );
  }

  function onClockClick() {
    open = view === 'clock' ? false : true;
    view = open ? 'clock' : null;
  }
</script>

<details bind:open>
  <summary>
    <p>{label}</p>
    <button onclick={onCalendarClick} type="button">{date}</button>
    <button onclick={onClockClick} type="button">{time}</button>
  </summary>
  {#if view === null || view === 'calendar'}
    <Calendar onchange={onCalendarChange} {value} />
  {:else}
    <Clock onchange={onClockChange} {value} />
  {/if}
</details>

<style>
  details {
    height: 48px;
    transition: height 300ms ease-in-out;
  }

  details[open] {
    height: 348px;
  }

  summary {
    align-items: center;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 8px;
    height: 48px;
    list-style: none;
    margin: 0;
    outline: none;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  summary::-webkit-details-marker,
  summary::marker {
    display: none;
  }

  summary button {
    align-items: center;
    appearance: none;
    background: #f4f4f4;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-family: 'Roboto Variable';
    font-size: 16px;
    font-weight: 400;
    height: 40px;
    letter-spacing: 0.10px;
    line-height: 24px;    
    margin: 0;
    outline: none;
    padding: 0 16px 0 16px;
    -webkit-tap-highlight-color: transparent;    
  }

  summary p {
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable';
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }
</style>
