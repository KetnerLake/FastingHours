<script>
  import DateTimePicker from "./DateTimePicker.svelte";  
  import HungerSelect from "./HungerSelect.svelte";  
  import Icon from "@iconify/svelte";
    
  let {
    item = null, 
    levels = [], 
    oncancel, 
    ondelete, 
    onsave
  } = $props();

  let dialog = $state();

  let current = $derived( item && item.level && item.level !== null ? item.level : 5 );

  function onCancelClick() {
    close();
    item = null
    if( oncancel ) oncancel();
  }

  function onDateChange( value ) {
    const created = new Date( value.getTime() );
    item = {... item, created};
  }

  function onDeleteClick() {
    if( ondelete ) ondelete( item.id );
  }  

  function onLevelChange( amount ) {
    const level = amount;
    item = {... item, level};
  }

  function onSaveClick() {
    if( onsave ) onsave( item );
  }

  export function close() {
    dialog.close();
    item = null;    
  }

  export function showModal() {
    dialog.showModal();
  }
</script>

<dialog bind:this={dialog}>

  <h3>Edit Hunger</h3>

  <HungerSelect items={levels} onchange={onLevelChange} value={current} />
  <DateTimePicker label="Checked" onchange={onDateChange} value={item && item.created ? item.created : new Date()} />

  <footer>
    <button class="delete" onclick={onDeleteClick} type="button">Delete</button>            
    <button class="cancel" onclick={onCancelClick} type="button">Cancel</button>    
    <button onclick={onSaveClick} type="button">Save</button>    
  </footer>

</dialog>

<style>
  @keyframes open {
    from {
      transform: translateY( 16px );
      opacity: 0;
    }
    to {
      transform: translateY( 0 );
      opacity: 1.0;
    }
  }

  dialog {
    background: #f8f8f8;
    border: none;
    border-radius: 4px;
    box-shadow: 
      0 0 40px -10px rgba( 0, 0, 0, 0.30 ), 
      0 0 25px -15px rgba( 0, 0, 0, 0.20 );  
    box-sizing: border-box;  
    flex-direction: column;
    outline: none;
    width: 330px;
  }

  dialog[open] {
    animation: open 0.30s forwards;
    display: flex;
  }

  footer {
    display: flex;
    flex-direction: row;
    gap: 16px;
    justify-content: flex-end;
    padding: 16px 0 0 0;
  }

  footer button {
    appearance: none;
    background: #0284c7;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    color: #ffffff;
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    outline: none;
    padding: 0 16px 0 16px;
    -webkit-tap-highlight-color: transparent;        
  }    

  footer button.cancel {
    background: none;
    border: solid 1px #00000040;
    color: #161616;
    font-weight: 400;
  }

  footer button.delete {
    background: #dc2626;
    margin-right: auto;
  }    

  h3 {
    color: #161616;
    cursor: default;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable';
    font-size: 20px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 28px;
    margin: 0;
    padding: 0 0 12px 0;
    text-align: left;
  } 
</style>
