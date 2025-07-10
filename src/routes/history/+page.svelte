<script>
  import "@fontsource-variable/roboto"; 
  import { onMount } from "svelte";     
  import Chart from "$lib/Chart.svelte";  
  import { Database } from "$lib/Database.svelte.js";
  import Editor from "$lib/Editor.svelte";  
  import Icon from "@iconify/svelte";
  import Table from "$lib/Table.svelte";
    
  const db = new Database();

  let id = $state( null );
  let start = $state( new Date() );
  let end = $state( new Date() );
  let notes = $state( null );

  /*
  let history = $state( [
    {start: new Date( 2025, 6, 1, 20, 0, 0 ), end: new Date( 2025, 6, 3, 12, 0, 0 )},
    {start: new Date( 2025, 6, 3, 20, 0, 0 ), end: new Date( 2025, 6, 5, 12, 0, 0 )},
    {start: new Date( 2025, 6, 5, 20, 0, 0 ), end: new Date( 2025, 6, 7, 12, 0, 0 )}
  ] ); 
  */
  let editor = $state();
  let history = $state( [] );
  /*
  let history = $state( [
    {start: new Date( 2025, 6, 1, 20, 0, 0 ), end: new Date( 2025, 6, 2, 12, 0, 0 )},    
    {start: new Date( 2025, 6, 2, 20, 0, 0 ), end: new Date( 2025, 6, 3, 12, 0, 0 )},        
    {start: new Date( 2025, 6, 3, 20, 0, 0 ), end: new Date( 2025, 6, 4, 12, 0, 0 )},            
    {start: new Date( 2025, 6, 6, 20, 30, 0 ), end: null}
  ] );
  */

  function onEditorSave( value ) {
    value.id = id;

    if( value.notes !== null ) {
      value.notes = value.notes.trim().length === 0 ? null : value.notes;
    }

    db.edit( value )
    .then( () => db.browse() )
    .then( ( data ) => history = [... data] );
  }

  function onTableChange( record ) {
    db.read( record ).then( ( item ) => {
      id = item.id;
      start = new Date( item.start.getTime() );
      end = new Date( item.end.getTime() );
      notes = item.notes ? item.notes : null;
      editor.show();
    } );
  }

  onMount( () => {
    db.browse().then( ( data ) => history = [... data] );
    // editor.show();
  } );
</script>

<section>
  <header>
    <h1>Fasting Hours</h1>
    <a href="/">
      <Icon height="20" icon="material-symbols:timer-outline-rounded" width="20" />
      <span>Timer</span>      
    </a>
  </header>
  {#if history.length > 0}
    <Chart value={history} />
    <Table onchange={onTableChange} value={history} />
  {:else}
    <article>
      <p>Your fasting history<br>will be displayed here.</p>
    </article>
  {/if}
</section>

<Editor bind:this={editor} {end} {notes} onsave={onEditorSave} {start} />

<style>
  :global( html ) {
    height: 100%;
  }

  :global( body ) {
    align-items: center;
    background: #f8f8f8;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  article {
    align-items: center;
    display: flex;
    flex-basis: 0;
    flex-grow: 1;
    justify-content: center;
  }

  article > p {
    box-sizing: border-box;
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable';
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    padding: 0;
    text-align: center;
  }

  header {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 64px;
    margin: 0;
    padding: 0 4px 0 4px;
    width: 100%;
  }

  header h1 {
    box-sizing: border-box;
    color: #161616;
    cursor: default;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 22px;
    font-weight: 400;
    line-height: 28px;
    margin: 0;
    padding: 0 0 0 12px;
    text-align: left;
  }

  header a {
    align-items: center;
    color: #0082ff;        
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    gap: 8px;
    margin: 0 12px 0 0;
    padding: 0;
    text-decoration: none;    
    -webkit-tap-highlight-color: none;    
  }

  section {
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    max-width: 430px;
    width: 100vw;
  }
</style>
