<script>
  let {children, label, oncancel, onsave} = $props();

  let dialog = $state();

  function onCancelClick() {
    hide();
    if( oncancel ) oncancel();
  }

  function onSaveClick() {
    hide();
    if( onsave ) onsave();
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
    <h3>{label}</h3>
    <button onclick={onSaveClick} type="button">Done</button>
  </header>  
  {@render children?.()}
</dialog>

<style>
  dialog {
    background: #ffffff;
    backdrop-filter: blur( 10px );
    background-color: rgba( 247, 247, 247, 0.70 );    
    border: none;
    border-radius: 8px;
    box-shadow: 
      0 0 40px -10px rgba( 0, 0, 0, 0.30 ), 
      0 0 25px -15px rgba( 0, 0, 0, 0.20 );    
    flex-direction: column;
    outline: none;
    overflow: auto;
    width: 330px;
    -webkit-backdrop-filter: blur( 10px );    
  }

  dialog[open] {
    animation: open 0.25s forwards;    
    display: flex;
    outline: none;    
  }

  dialog::backdrop {
    opacity: 0;
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
</style>
