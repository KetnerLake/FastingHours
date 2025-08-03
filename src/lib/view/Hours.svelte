<script>
  import Chart from "$lib/Chart.svelte";
  import {Database} from "$lib/Database.svelte";
  import HistoryEditor from "$lib/HistoryEditor.svelte";
  import HungerEditor from "$lib/HungerEditor.svelte";  
  import List from "$lib/List.svelte";
  import {onMount} from "svelte";  
  import WaterEditor from "$lib/WaterEditor.svelte";

  let {levels = []} = $props();

  const db = new Database();

  let interval = null;

  let feditor = $state();
  let heditor = $state();
  let history = $state( [] );
  let history_field = $state( 'started' );
  let history_item = $state( null );
  let history_label = $state( 'Started' );
  let history_title = $state( 'Edit Fast Started' );
  let hunger = $state( null );  
  let timeline = $state( [] );
  let water = $state( null );
  let weditor = $state();  

  onMount( () => {
    loadData();
    interval = setInterval( () => {
      loadData( false );
    }, 60000 );
  } );

  function loadData( complete = true ) {
    let chronos = null;

    db.browseHistory()
    .then( ( data ) => {
      history = [... data];

      if( complete ) {
        let started = structuredClone( data );
        started.forEach( ( value ) => {
          value.type = 'start';
          value.timed = new Date( value.started.getTime() );
        } );

        const ended = structuredClone( data );
        ended.filter( ( value ) => value.ended === null ? false : true );
        ended.forEach( ( value ) => {
          value.type = 'end';
          value.timed = new Date( value.ended.getTime() );
        } );

        started = started.concat( ended );
        chronos = [... started];

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

          timeline = [... chronos];
        } );
      }
    } );
  }

  function onHistoryDelete( id ) {
    db.deleteHistory( id )
    .then( () => {
      heditor.close();
      history_item = null;
      loadData( true );
    } );
  }

  function onHistorySave( item ) {
    db.editHistory( item )
    .then( ( data ) => {
      heditor.close();
      history_item = null;
      loadData( true );
    } );
  }  

  function onHungerDelete( id ) {
    db.deleteHunger( id )
    .then( () => {
      feditor.close();
      hunger = null;
      loadData( true );
    } );
  }

  function onHungerSave( item ) {
    db.editHunger( item )
    .then( ( data ) => {
      feditor.close();
      hunger = null;
      loadData( true );
    } );
  }  

  function onListChange( source, id ) {
    if( source === 'start' ) {
      history_field = 'started';
      history_label = 'Started';
      history_title = 'Edit Fast Started';

      db.readHistory( id )
      .then( ( data ) => {
        history_item = {... data};
        heditor.showModal();
      } );      
    } else if( source === 'end' ) {
      history_field = 'ended';
      history_label = 'Ended';
      history_title = 'Edit Fast Ended';

      db.readHistory( id )
      .then( ( data ) => {
        history_item = {... data};
        heditor.showModal();
      } );
    } else if( source === 'water' ) { 
      db.readWater( id )
      .then( ( data ) => {
        water = {... data};
        weditor.showModal();
      } );
    } else if( source === 'hunger' ) {
      db.readHunger( id )
      .then( ( data ) => {
        hunger = {... data};
        feditor.showModal();
      } );
    }
  }

  function onWaterDelete( id ) {
    db.deleteWater( id )
    .then( () => {
      weditor.close();
      water = null;
      loadData( true );
    } );
  }

  function onWaterSave( item ) {
    db.editWater( item )
    .then( ( data ) => {
      weditor.close();
      water = null;
      loadData( true );
    } );
  }
</script>

<section>

  <Chart {history} />
  <List items={timeline} onchange={onListChange} />

  <HistoryEditor bind:this={heditor} field={history_field} item={history_item} label={history_label} title={history_title} ondelete={onHistoryDelete} onsave={onHistorySave} />
  <HungerEditor bind:this={feditor} item={hunger} {levels} oncancel={() => hunger = null} ondelete={onHungerDelete} onsave={onHungerSave} />
  <WaterEditor bind:this={weditor} item={water} oncancel={() => water = null} ondelete={onWaterDelete} onsave={onWaterSave} />

</section>

<style>
  section {
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    margin-top: 16px;
    overflow: auto;
    width: 100%;
  }
</style>
