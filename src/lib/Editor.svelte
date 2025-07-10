<script>
  import DateTimePicker from "./DateTimePicker.svelte";

  let {end = new Date(), notes = null, oncancel, onsave, start = new Date()} = $props();

  let dialog = $state();
  
  function onCancelClick() {
    hide();
    start = new Date();
    end = new Date();
    notes = null;
    if( oncancel ) oncancel();
  }

  function onEndChange( selected ) {
    end = new Date( selected.getTime() );
  }

  function onSaveClick() {
    if( start.getTime() > end.getTime() ) {
      alert( 'Start time cannot be greater than end time.' );
      return;
    }
      
    hide();
    
    if( onsave ) onsave( {
      start: new Date( start.getTime() ),
      end: new Date( end.getTime() ),
      notes
    } );
  }

  function onStartChange( selected ) {
    start = new Date( selected.getTime() );
  }

  export function hide() {
    dialog.close();
  }

  export function show() {
    dialog.showModal();
  }
</script>

<dialog bind:this={dialog}>
  <header>
    <button onclick={onCancelClick} type="button">Cancel</button>    
    <h3>Edit Fast</h3>
    <button onclick={onSaveClick} type="button">Done</button>
  </header>
  <DateTimePicker label="Start" onchange={onStartChange} value={start} />
  <DateTimePicker label="End" onchange={onEndChange} value={end} />  
  <textarea bind:value={notes} placeholder="Notes"></textarea>
</dialog>

<style>
  dialog {
    background: #ffffff;
    border: none;
    border-radius: 8px;
    flex-direction: column;
    outline: none;
    overflow: auto;
    width: 330px;
  }

  dialog[open] {
    display: flex;
  }

  header {
    align-items: center;
    display: grid;
    grid-template-columns: 100px 1fr 100px;
    height: 48px;
    margin: 0;
    padding: 0;
    position: sticky;
    top: 0;
  }

  header button {
    appearance: none;
    background: none;
    border: none;
    color: #0082ff;
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    outline: none;
    padding: 0;
    -webkit-tap-highlight-color: transparent;        
  }

  header button:first-of-type {
    justify-self: start;
  }

  header button:last-of-type {
    justify-self: end;
  }  

  h3 {
    color: #161616;
    cursor: default;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable';
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    padding: 0;
    text-align: center;
  }  

  textarea {
    appearance: none;
    background: #f4f4f4;
    border: none;
    border-radius: 4px;
    color: #161616;
    font-family: 'Roboto Variable';
    font-size: 16px;
    font-weight: 400;
    height: 100px;
    min-height: 40px;
    resize: none;
    margin: 12px 0 0 0;
    padding: 12px;
    -webkit-tap-highlight-color: transparent;    
  }

  textarea::placeholder {
    color: #d5d5d5;
  }
</style>
