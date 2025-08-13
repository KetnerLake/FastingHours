<script>
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  let {items = [], onchange, units = 'oz', value = 0} = $props();  

  let open = $state( false );

  let button = $state();
  let popover = $state();

  let label = $derived.by( () => {
    if( items.length === 0 ) return '';

    const match = items.find( ( current ) => current.value === value ? true : false );
    return match.label;
  } );

  onMount( () => {
    document.addEventListener( 'click', onDocumentClick );
    return () => {
      document.removeEventListener( 'click', onDocumentClick );
    };    
  } );

  function onButtonClick() {
    const rect = button.getBoundingClientRect();
    popover.style.width = ( rect.width - 2 ) + 'px';
    open = !open;
  }

  function onDocumentClick( evt ) {
    if( !button.contains( evt.target ) && !popover.contains( evt.target ) ) {
      open = false;
    }
  }

  function onItemClick( item ) {
    value = item.value;
    open = false;

    if( onchange ) onchange( item.value );
  }
</script>

<label>

  <button bind:this={button} onclick={onButtonClick} tabindex="-1" type="button">
    <span>{label}</span>
    <span>{value} {units}</span>    
    <Icon height="20" icon="material-symbols:keyboard-arrow-down-rounded" width="20" />
  </button>

  <ul bind:this={popover} class:open>
    {#each items as item}
      <li class:selected={value === item.value ? true : false}>
        <button onclick={() => onItemClick( item )} type="button">
          <span>{item.label}</span>
          <span>{item.value} oz</span>          
          {#if item.value === value}
            <Icon height="20" icon="material-symbols:check-rounded" width="20" />          
          {/if}
        </button>
      </li>
    {/each}
  </ul>

</label>

<style>
  @keyframes open {
    from {
      transform: translateY( -16px );
      opacity: 0;
    }
    to {
      transform: translateY( 0 );
      opacity: 1.0;
    }
  }

  label {
    margin: 0 0 16px 0;
    position: relative;
    width: 100%;
  }

  label > button {
    align-items: center;
    appearance: none;
    background: #ffffff;
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 8px;
    height: 40px;
    margin: 0;
    outline: none;
    padding: 0 12px 0 12px;
    transition: 
      border 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;
    width: 100%;
    -webkit-tap-highlight-color: transparent;      
  }

  label > button span {
    color: #161616;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 24px;
    text-align: left;
  }

  label > button:focus {
    border: solid 1px #0284c7;
    box-shadow: 0 0 0 3px rgb( from #0284c7 r g b / 0.40 );    
  } 

  ul {
    background: #ffffff;
    border: solid 1px #00000040;
    border-radius: 4px;
    box-shadow: rgba( 113, 113, 122, 0.12 ) 0px 2px 8px 0px;
    display: none;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 4px 0 4px 0;
    position: absolute;
    right: 0;
    top: calc( 100% + 2px );        
    z-index: 25;
  }

  ul.open {
    animation: open 0.30s forwards;            
    display: flex;
  }

  ul li {
    margin: 0;
    padding: 0;
  }

  ul li button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    gap: 8px;
    height: 40px;
    margin: 0;
    outline: none;
    padding: 0 32px 0 12px;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }  

  ul li button span {
    color: #161616;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 24px;
    text-align: left;
  }  

  ul li button:hover {
    background: #00000010;
  }

  ul li button:hover span {
    color: #000000;
  }  

  ul li.selected button {
    background: #0284c7;
    color: #ffffff;
    padding: 0 12px 0 12px;    
  }

  ul li.selected button span {
    color: #ffffff;
    font-weight: 500;        
  }  
</style>
