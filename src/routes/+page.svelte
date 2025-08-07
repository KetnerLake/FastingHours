<script>
  import "@fontsource-variable/roboto";   
  import { Database } from "$lib/Database.svelte";  
  import daylight from "suncalc";      
  import FastingView from "$lib/FastingView.svelte";
  import HistoryEditor from "$lib/HistoryEditor.svelte";    
  import HoursView from "$lib/HoursView.svelte";
  import HungerEditor from "$lib/HungerEditor.svelte";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";  
  import RadioGroup from "$lib/RadioGroup.svelte";
  import Settings from "$lib/Settings.svelte";  
  import WaterEditor from "$lib/WaterEditor.svelte";

  const db = new Database();
  const SunCalc = daylight;  

  let seconds = 0;

  let activity = $state( [] );
  let history = $state( [] );
  let history_editor = $state();
  let history_field = $state( 'started' );  
  let history_item = $state( null );
  let history_label = $state( 'Started' );
  let history_title = $state( 'Edit Fast Started' );  
  let hunger_editor = $state();
  let hunger_item = $state( null );
  let hunger = $state( 5 );
  let levels = $state( [
    {value: 1, label: 'Starving'}, 
    {value: 2, label: 'Very hungry'}, 
    {value: 3, label: 'Pretty hungry'}, 
    {value: 4, label: 'Snacky'}, 
    {value: 5, label: 'Satisfied'},
    {value: 6, label: 'Slightly full'},
    {value: 7, label: 'Uncomfortable'},
    {value: 8, label: 'Stuffed'},
    {value: 9, label: 'Stomach aches'},
    {value: 10, label: 'Sick'}
  ] );    
  let now = $state( null );
  let screen = $state( 0 );    
  let settings = $state();  
  let started = $state( null );
  let sun = $state( null );
  let water = $state( 0 );
  let water_editor = $state();
  let water_item = $state( null );

  onMount( () => {
    // Last screen viewed
    // Pick up where left off
    let index = window.localStorage.getItem( 'fh_screen' );
    screen = index === null ? 0 : parseInt( index );

    // Location
    const latitude = window.localStorage.getItem( 'fh_latitude' );
    if( latitude !== null && latitude !== 'DENIED' ) {
      loadSun();
    }

    // Updates while on page
    setInterval( () => {
      if( seconds === 60 ) {
        loadActivity();

        const latitude = window.localStorage.getItem( 'fh_latitude' );
        if( latitude !== null && latitude !== 'DENIED' ) {
          loadSun();
        }

        seconds = 0;
      } else {
        seconds = seconds + 1;
      }

      if( started !== null ) {
        now = Date.now();
      }
    }, 1000 );

    // Core data
    loadStart();
    loadActivity();
    loadHunger();
    loadWater();
    loadHistory();
  } );

  function formatLocalDate( date ) {
    const y = date.getFullYear();
    const m = String( date.getMonth() + 1 ).padStart( 2, '0' );
    const d = String( date.getDate() ).padStart( 2, '0' );
    return `${y}-${m}-${d}`;
  }  

  function loadActivity( days = 7 ) {
    db.browseHistory()
    .then( ( data ) => {
      const tempResult = {};
      const now_date = new Date();
      const endDate = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate());
      const startLimitDate = new Date(endDate);
      startLimitDate.setDate(endDate.getDate() - ( days - 1 )); // 10 days including today

      // --- Step 1: Fill tempResult with activity or zeros ---
      if (!Array.isArray(data) || data.length === 0) {
        const date = new Date(startLimitDate);
        while (date <= endDate) {
          const key = formatLocalDate(date);
          tempResult[key] = Array(24).fill(0);
          date.setDate(date.getDate() + 1);
        }
      } else {
        for (const action of data) {
          const start = new Date(action.started);
          const end = action.ended ? new Date(action.ended) : new Date();

          const startTime = new Date(start.getTime());
          startTime.setSeconds(0, 0);
          const endTime = new Date(end.getTime());
          endTime.setSeconds(0, 0);

          let current = new Date(startTime);

          while (current < endTime) {
            const dateKey = formatLocalDate(current);
            const dateOnly = new Date(current.getFullYear(), current.getMonth(), current.getDate());

            if (dateOnly >= startLimitDate && dateOnly <= endDate) {
              const hour = current.getHours();
              if (!tempResult[dateKey]) {
                tempResult[dateKey] = Array(24).fill(0);
              }
              tempResult[dateKey][hour] += 1; // one minute of activity
            }

            current.setMinutes(current.getMinutes() + 1);
          }
        }

        // Convert to fractional hours (max 1 per hour)
        for (const date in tempResult) {
          tempResult[date] = tempResult[date].map(mins => +(Math.min(mins, 60) / 60).toFixed(6));
        }

        // Ensure full 10-day range is covered
        const fillDate = new Date(startLimitDate);
        while (fillDate <= endDate) {
          const key = formatLocalDate(fillDate);
          if (!tempResult[key]) {
            tempResult[key] = Array(24).fill(0);
          }
          fillDate.setDate(fillDate.getDate() + 1);
        }
      }

      // --- Step 2: Sort dates in descending order ---
      const sortedKeys = Object.keys(tempResult).sort((a, b) => b.localeCompare(a));
      const dailyActivity = {};
      for (const key of sortedKeys) {
        dailyActivity[key] = tempResult[key];
      }

      // --- Step 3: Compute average hourly activity ---
      const hourTotals = Array(24).fill(0);
      for (const hour of Array(24).keys()) {
        for (const date of sortedKeys) {
          hourTotals[hour] += dailyActivity[date][hour];
        }
      }

      const averageHourlyActivity = hourTotals.map(total => +(total / 10).toFixed(6));

      // --- Final result ---
      activity = {
        daily: dailyActivity,
        average: averageHourlyActivity
      };
    } );    
  }

  function loadHistory() {
    db.browseHistory()
    .then( ( data ) => {
      let chronos = null;

      let start = structuredClone( data );
      start.forEach( ( value ) => {
        value.type = 'start';
        value.timed = new Date( value.started.getTime() );
      } );

      let end = structuredClone( data );
      end = end.filter( ( value ) => value.ended === null ? false : true );
      end.forEach( ( value ) => {
        value.type = 'end';
        value.timed = new Date( value.ended.getTime() );
      } );

      start = start.concat( end );
      chronos = [... start];

      db.browseHunger()
      .then( ( data ) => {
        data = data.map( ( value ) => {
          const hunger = levels.find( ( current ) => current.value === value.level );
          value.level = hunger.label;
          value.timed = new Date( value.created.getTime() );
          return value;
        } );
        chronos = chronos.concat( data );
        return db.browseWater();
      } )
      .then( ( data ) => {
        data = data.map( ( value ) => {
          value.timed = new Date( value.created.getTime() );
          return value;
        } );
        chronos = chronos.concat( data );

        chronos.sort( ( a, b ) => {
          if( a.timed.getTime() < b.timed.getTime() ) return 1;
          if( a.timed.getTime() > b.timed.getTime() ) return -1;            
          return 0;
        } );

        const dates = [];

        for( let c = 0; c < chronos.length; c++ ) {
          const zeroed = new Date( chronos[c].timed.getTime() );
          zeroed.setHours( 23 );
          zeroed.setMinutes( 59 );
          zeroed.setSeconds( 59 );
          zeroed.setMilliseconds( 999 );

          if( dates.length === 0 ) {
            dates.push( {
              type: 'header',
              timed: zeroed 
            } );
          } else {
            if( 
              dates[dates.length - 1].timed.getDate() !== chronos[c].timed.getDate() ||
              dates[dates.length - 1].timed.getMonth() !== chronos[c].timed.getMonth() ||
              dates[dates.length - 1].timed.getFullYear() !== chronos[c].timed.getFullYear()
            ) {
              dates.push( {
                type: 'header',
                timed: zeroed
              } );
            }
          }
        }

        chronos = chronos.concat( dates );
        chronos.sort( ( a, b ) => {
          if( a.timed.getTime() < b.timed.getTime() ) return 1;
          if( a.timed.getTime() > b.timed.getTime() ) return -1;            
          return 0;
        } );          

        history = [... chronos];
      } );
    } );
  }

  function loadHunger() {
    db.browseHunger( true )
    .then( ( item ) => {
      if( item === null ) {        
        hunger = 5;
      } else {
        hunger = item.level;
      }
    } ); 
  }

  function loadStart() {
    db.browseHistory()
    .then( ( data ) => {
      if( data.length === 0 ) {
        started = null;
        now = null;
      }

      data.sort( ( a, b ) => {
        if( a.started.getTime() > b.started.getTime() ) return -1;
        if( a.started.getTime() < b.started.getTime() ) return 1;
        return 0;        
      } );

      if( data[0].ended === null ) {
        started = new Date( data[0].started.getTime() );
        now = Date.now();
      }
    } );
  }

  function loadSun() {
    const latitude = parseFloat( window.localStorage.getItem( 'fh_latitude' ) );
    const longitude = parseFloat( window.localStorage.getItem( 'fh_longitude' ) );
    const today = new Date();

    let icon = null;    
    let times = SunCalc.getTimes( today, latitude, longitude );
    let timing = null;

    if( Date.now() < times.sunrise.getTime() ) {
      timing = new Date( times.sunrise.getTime() );
      icon = 'material-symbols:wb-sunny-outline-rounded';
    } else if( Date.now() > times.sunrise.getTime() && Date.now() < times.sunset.getTime() ) {
      timing = new Date( times.sunset.getTime() );
      icon = 'material-symbols:moon-stars-outline-rounded';          
    } else {
      const tomorrow = new Date();
      tomorrow.setDate( today.getDate() + 1 );

      times = SunCalc.getTimes( tomorrow, latitude, longitude );
      timing = new Date( times.sunrise.getTime() );
      icon = 'material-symbols:wb-sunny-outline-rounded';
    }    

    sun = {
      icon,
      timing
    };
  }

  function loadWater() {
    db.browseWater( true )
    .then( ( data ) => {
      const total = data.reduce( ( previous, current ) => {
        return previous + current.volume;
      }, 0 );
      water = total;
    } );    
  }

  function onFastingEnd() {
    started = null;    
    now = null;

    db.browseHistoryByEnd()
    .then( ( data ) => {
      data.ended = new Date();
      return db.editHistory( data );
    } )
    .then( () => {
      loadStart();
      loadActivity();
      loadHistory();
    } );    
  }

  function onFastingHunger() {
    hunger_editor.showModal();
  }

  function onFastingStart() {
    db.addHistory()
    .then( () => {
      loadStart();
      loadActivity();
      loadHistory();
    } );
  }

  function onFastingWater() {
    water_editor.showModal();
  }

  function onHistoryDelete( id ) {
    // If deletion is actively running fast
    if( started !== null ) {
      if( history_item.started.getTime() === started.getTime() ) {
        started = null;
        now = null;
      }
    }

    db.deleteHistory( id )
    .then( () => {
      history_editor.close();
      history_item = null;

      loadStart();
      loadActivity();
      loadHistory();
    } );
  }

  function onHistorySave( item ) {
    db.editHistory( item )
    .then( () => {
      history_editor.close();
      history_item = null;

      loadStart();
      loadActivity();
      loadHistory();
    } );
  }

  function onHoursChange( source, id ) {
    if( source === 'start' ) {
      history_field = 'started';
      history_label = 'Started';
      history_title = 'Edit Fast Started';

      db.readHistory( id )
      .then( ( data ) => {
        history_item = {... data};
        history_editor.showModal();
      } );      
    } else if( source === 'end' ) {
      history_field = 'ended';
      history_label = 'Ended';
      history_title = 'Edit Fast Ended';

      db.readHistory( id )
      .then( ( data ) => {
        history_item = {... data};
        history_editor.showModal();
      } );
    } else if( source === 'water' ) { 
      db.readWater( id )
      .then( ( data ) => {
        water_item = {... data};
        water_editor.showModal();
      } );
    } else if( source === 'hunger' ) {
      db.readHunger( id )
      .then( ( data ) => {
        hunger_item = {... data};
        hunger_editor.showModal();
      } );
    }
  }

  function onHungerDelete( id ) {
    db.deleteHunger( id )
    .then( () => {
      hunger_editor.close();
      hunger_item = null;
      loadHunger();
      loadHistory();
    } );
  }  

  function onHungerSave( value ) {
    if( hunger_item === null ) {
      db.addHunger( value.level )
      .then( ( item ) => {
        hunger_editor.close();
        loadHunger();
        loadHistory();
      } );      
    } else {
      db.editHunger( value )
      .then( ( data ) => {
        hunger_editor.close();
        hunger_item = null;
        loadHunger();
        loadHistory();
      } );
    }
  }

  function onScreenClick( index ) {
    if( screen !== index ) {
      window.localStorage.setItem( 'fh_screen', index );
      screen = index;
    }
  }

  function onSettingsClick() {
    settings.showModal();
  }

  function onSunEnable() {
    const response = confirm( 'Sunrise/set (important for religious observations) needs to know your location? Enable location detection?' );
    
    if( response ) {
      navigator.geolocation.getCurrentPosition( ( position ) => {
        window.localStorage.setItem( 'fh_latitude', position.coords.latitude );
        window.localStorage.setItem( 'fh_longitude', position.coords.longitude );
        loadSun();
      } );
    } else {
      window.localStorage.setItem( 'fh_latitude', 'DENIED' );
    }
  }  

  function onWaterDelete( id ) {
    db.deleteWater( id )
    .then( () => {
      water_editor.close();
      water_item = null;
      loadWater();
      loadHistory();
    } );
  }

  function onWaterSave( value ) {
    if( water_item === null ) {
      db.addWater( value.volume )
      .then( ( item ) => {
        water_editor.close();
        loadWater();
        loadHistory();
      } );
    } else {
      db.editWater( value )
      .then( ( data ) => {
        water_editor.close();
        water_item = null;
        loadWater();
        loadHistory();
      } );      
    }
  }
</script>

<main>

  <header>
    <span></span>
    <RadioGroup onchange={onScreenClick} selected={screen} />
    <button onclick={onSettingsClick} type="button">
      <Icon height="20" icon="material-symbols:settings-outline" width="20" />
    </button>
  </header>

  <section data-screen={screen === 0 ? 'fasting' : 'hours'}>
    <article>
      <FastingView 
        {activity} 
        {hunger} 
        {levels} 
        {now}
        onend={onFastingEnd}
        onhunger={onFastingHunger}
        onsettings={onSettingsClick} 
        onstart={onFastingStart}
        onsun={onSunEnable}
        onwater={onFastingWater}
        {started}
        {sun}
        {water} />
    </article>
    <article>
      <HoursView 
        {activity} 
        {history} 
        {levels} 
        onchange={onHoursChange} 
        onsun={onSunEnable}
        {sun} />
    </article>
  </section>

</main>

<HistoryEditor 
  bind:this={history_editor} 
  field={history_field}
  item={history_item} 
  label={history_label}
  ondelete={onHistoryDelete}
  onsave={onHistorySave} 
  title={history_title} />
<HungerEditor 
  bind:this={hunger_editor} 
  item={hunger_item}
  {levels} 
  ondelete={onHungerDelete}
  onsave={onHungerSave} />
<WaterEditor 
  bind:this={water_editor} 
  item={water_item}
  ondelete={onWaterDelete}
  onsave={onWaterSave} />
<Settings bind:this={settings} />

<style>
  :global( html ) {
    height: 100%;
  }

  :global( body ) {
    background: #ffffff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  article {
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
  }

  article:last-of-type {
    max-width: 330px;    
  }

  button {
    align-items: center;
    appearance: none;
    background: none;
    border: solid 1px #00000040;
    border-radius: 40px;
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

  header {
    box-sizing: border-box;
    display: grid;
    display: none;
    grid-template-columns: 44px 1fr 44px;
    padding: 16px 12px 0 12px;
    width: 100%;
  }

  main {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    margin: 0;
    padding: 0;    
  }

  section {
    display: flex;
    flex-basis: 0;
    flex-direction: row;  
    flex-grow: 1;  
    height: 100%;
    overflow: hidden;
    width: 100%;
  }  

@media( max-width: 780px ) {
  article:last-of-type {
    max-width: unset;
  }

  header {
    display: grid;
  }

  section {
    flex-direction: column;
  }  

  section[data-screen=fasting] article:first-of-type {
    display: flex;
  }

  section[data-screen=fasting] article:last-of-type {
    display: none;
  }

  section[data-screen=hours] article:first-of-type {
    display: none;
  }    

  section[data-screen=hours] article:last-of-type {
    display: flex;
  }      
}  
</style>
