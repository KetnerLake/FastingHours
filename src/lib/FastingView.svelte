<script>
  import DurationGroup from "./DurationGroup.svelte";  
  import GraphSection from "./GraphSection.svelte";  
  import Icon from "@iconify/svelte";
  import Timer from "$lib/Timer.svelte";

  let {
    activity = null,
    duration = 0,
    hunger = 5, 
    levels = [],
    now = null, 
    onduration,
    onend, 
    onhunger, 
    onsettings, 
    onstart, 
    onsun,
    onwater, 
    started = null, 
    sun = null,
    volume = null,
    water = 0
  } = $props();

  function formatHunger( value ) {
    const item = levels.find( ( current ) => current.value === value ? true : false );
    return item.label;
  }

  function formatStarted( value ) {
    if( value === null ) return null;

    const formatter = new Intl.DateTimeFormat( navigator.language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    } );

    return formatter.format( value );
  }

  function onFastingClick() {
    if( started === null ) {
      if( onstart ) onstart();
    } else {
      if( onend ) onend();
    }
  }
</script>

<section>

  <header>
    <h3>Fasting</h3>
    <button onclick={onsettings} type="button">
      <Icon height="20" icon="material-symbols:person-outline-rounded" width="20" />      
    </button>
  </header>

  <article>
    {#if started === null}
      <p>You are not fasting.</p>  
    {:else}
      <p>You are fasting.</p>    
      <Timer {duration} {now} {started} />    
      <DurationGroup onchange={onduration} value={duration} />
      <p class="started">Started {formatStarted( started )}</p>
    {/if}
    <button class="primary" onclick={onFastingClick} type="button">
      {started === null ? 'Start' : 'Stop'} fasting
    </button>
  </article>

  <div class="graph">
    <GraphSection
      {activity}
      days={7}
      {onsun}
      {sun}
      water={volume} />
  </div>

  <footer>
    <button class="hunger secondary" onclick={onhunger} type="button">
      <Icon 
        height="20" 
        icon="material-symbols:fork-spoon-rounded" 
        width="20" />
      <span>{formatHunger( hunger )}</span>
    </button>  
    <button class="water secondary" onclick={onwater} type="button">
      <Icon 
        height="20" 
        icon="material-symbols:water-drop-outline-rounded" 
        width="20" />
      <span>{water} oz</span>    
    </button>    
  </footer>

</section>

<style>
  button.primary {
    align-items: center;
    appearance: none;
    background: #0284c7;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    gap: 8px;
    justify-content: center;
    letter-spacing: 0.10px;
    line-height: 20px;
    height: 40px;
    margin: 0;
    outline: none;
    padding: 0 16px 0 16px;
    -webkit-tap-highlight-color: transparent;
  }

  button.secondary {
    align-items: center;
    appearance: none;
    background: #ffffff;
    border: solid 1px #00000040;
    border-radius: 4px;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: flex;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    gap: 8px;
    justify-content: center;
    letter-spacing: 0.10px;
    line-height: 20px;
    height: 40px;
    margin: 0;
    outline: none;
    padding: 0 16px 0 16px;
    -webkit-tap-highlight-color: transparent;    
  }

  button.hunger {
    justify-self: start;
    padding: 0 16px 0 12px;    
  }

  button.water {
    justify-self: end;
    padding: 0 16px 0 12px;    
  }

  footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 12px 16px 12px 16px;
  }

  header {
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 16px 16px 0 16px    
  }

  header button {
    align-items: center;
    appearance: none;
    background: none;
    border: solid 1px #00000040;
    border-radius: 4px;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    justify-self: end;
    margin: 0;
    outline: none;
    padding: 0;
    width: 40px;
    -webkit-tap-highlight-color: transparent;
  }

  header h3 {
    color: #161616;
    cursor: default;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 32px;
    font-weight: 600;
    line-height: 36px;
    margin: 0;
    padding: 0;
  }

  p {
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;    
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }

  p.started {
    color: #00000040;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;    
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 0;    
  }

  section {
    border-right: solid 1px #00000040;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
  }

  article {
    align-items: center;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    gap: 16px;
    justify-content: center;
    width: 100%;
  }  

  @media( max-width: 780px ) {  
    div.graph {
      display: none;
    }

    header {
      display: none;
    }
  }
</style>
