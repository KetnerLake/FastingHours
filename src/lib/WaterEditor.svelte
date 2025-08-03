<script>
  import Icon from "@iconify/svelte";

  let {item = null, oncancel, ondelete, onsave, units = 'oz'} = $props();

  let dialog = $state();
  let sizes = $state( [
    {value: 8, label: 'Cup'}, 
    {value: 12, label: 'Can'}, 
    {value: 16, label: 'Bottle'}, 
    {value: 20, label: 'Medium'}, 
    {value: 30, label: 'Gatorade'},
    {value: 32, label: 'Big Q'},
    {value: 44, label: 'QT Large'},
    {value: 52, label: 'Extra Large'}
  ] );

  let volume = $derived( item && item.volume && item.volume !== null ? item.volume : 8 );  

  function onCancelClick() {
    close();
    item = null;
    if( oncancel ) oncancel();
  }

  function onDeleteClick() {
    if( ondelete ) ondelete( item.id );
  }

  function onSaveClick() {
    if( item === null ) {
      const volume = 8;
      item = {... item, volume};
    }

    if( onsave ) onsave( item );
  }

  function onSizeClick( amount ) {
    const volume = amount;
    item = {... item, volume};
  }

  export function close() {
    dialog.close();
  }

  export function showModal() {
    dialog.showModal();
  }
</script>

<dialog bind:this={dialog}>

  <h3>{item && item.id && item.id !== null ? 'Edit' : 'Add'} Water</h3>

  <ul>
    {#each sizes as size}
      {@const icon = size.value === volume ? 'material-symbols:radio-button-checked-outline' : 'material-symbols:circle-outline'}
      <li>
        <button onclick={() => onSizeClick( size.value )} type="button">
          <p>{size.label}</p>  
          <p>{size.value} {units}</p>
          <Icon 
            color={size.value === volume ? '#0284c7' : '#161616'} 
            height="20" 
            {icon} 
            width="20" />
        </button>
      </li>
    {/each}
  </ul>

  <footer>
    {#if item && item.id && item.id !== null}
      <button class="delete" onclick={onDeleteClick} type="button">Delete</button>            
    {/if}
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

  ul {
    background: #ffffff;
    border-radius: 4px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul li {
    border-bottom: solid 1px #00000010;
    box-sizing: border-box;
    cursor: pointer;
    margin: 0;
    padding: 0;
  }

  ul li:last-of-type {
    border-bottom: solid 1px transparent;
  }  

  ul li button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    height: 40px;
    margin: 0;
    outline: none;
    padding: 0 12px 0 16px;    
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  ul li button p {
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    padding: 0;      
    text-align: left;
  }
</style>
