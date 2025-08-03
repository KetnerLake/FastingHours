<script>
  import "@fontsource-variable/roboto"; 
  import {Database} from "$lib/Database.svelte";     
  import HungerEditor from "$lib/HungerEditor.svelte";
  import Icon from "@iconify/svelte";
  import {onMount} from "svelte";
  import Timer from "$lib/Timer.svelte";
  import WaterEditor from "$lib/WaterEditor.svelte";
    import Adsense from "$lib/Adsense.svelte";

  let {levels = []} = $props();

  const db = new Database();

  let interval = null;

  let heditor = $state();
  let level = $state( 5 );
  let now = $state( null );
  let started = $state( null );
  let water = $state( 0 );
  let weditor = $state();

  let formatted = $derived.by( () => {
    if( started === null ) return null;

    const formatter = new Intl.DateTimeFormat( navigator.language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    } );

    return formatter.format( started );
  } );  

  let hunger = $derived.by( () => {
    const item = levels.find( ( current ) => current.value === level ? true : false );
    return item.label;
  } );

  onMount( () => {
    const begin = window.localStorage.getItem( 'fh_started' );
    started = begin === null ? null : new Date( parseInt( begin ) );

    if( started !== null ) {
      now = Date.now();

      interval = setInterval( () => {
        now = Date.now();
      }, 1000 );      
    }

    db.browseHunger( true ).then( ( item ) => {
      if( item !== null ) {
        level = item.level;
      }

      return db.browseWater( true );
    } ).then( ( data ) => {
      const total = data.reduce( ( previous, current ) => {
        return previous + current.volume;
      }, 0 );
      water = total;
    } );    
  } );

  function onFastingClick() {
    if( started === null ) {
      now = Date.now();
      started = new Date();
      window.localStorage.setItem( 'fh_started', started.getTime() );
      db.addHistory();

      interval = setInterval( () => {
        now = Date.now();
      }, 1000 );
    } else {
      clearInterval( interval );
      interval = null;

      now = null;
      started = null;
      
      window.localStorage.removeItem( 'fh_started' );

      db.browseHistoryByEnd().then( ( data ) => {
        data.ended = new Date();
        return db.editHistory( data );
      } );
    }    
  }

  function onHungerClick() {
    heditor.showModal();
  }

  function onHungerSave( value ) {
    console.log( value );

    heditor.close();

    db.addHunger( value.level )
    .then( ( item ) => level = item.level );        
  }

  function onWaterClick() {
    weditor.showModal();
  }

  function onWaterSave( value ) {
    weditor.close();

    db.addWater( value.volume )
    .then( ( item ) => db.browseWater( true ) )
    .then( ( data ) => {
      const total = data.reduce( ( previous, current ) => {
        return previous + current.volume;
      }, 0 );
      water = total;
    } );    
  }
</script>

<section>

  <article>

    {#if started === null}
      <p>You are not fasting.</p>  
    {:else}
      <p>You are fasting.</p>    
      <Timer {now} {started} />    
      <p class="started">Started {formatted}</p>
    {/if}

    <button class="primary" onclick={onFastingClick} type="button">
      {started === null ? 'Start' : 'Stop'} fasting
    </button>

  </article>

  <Adsense />

  <footer>
    <button class="hunger secondary" onclick={onHungerClick} type="button">
      <Icon 
        height="20" 
        icon="material-symbols:fork-spoon-rounded" 
        width="20" />
      <span>{hunger}</span>
    </button>  
    <button class="water secondary" onclick={onWaterClick} type="button">
      <Icon 
        height="20" 
        icon="material-symbols:water-drop-outline-rounded" 
        width="20" />
      <span>{water} oz</span>    
    </button>    
  </footer>

  <HungerEditor bind:this={heditor} {levels} {level} onsave={onHungerSave} />
  <WaterEditor bind:this={weditor} onsave={onWaterSave} />

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
    padding: 12px;
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
</style>
