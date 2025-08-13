<script>
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";

  let {
    items = [], 
    onchange,
    value = 5
  } = $props();  

  let open = $state( false );

  let button = $state();
  let popover = $state();

  let label = $derived.by( () => {
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
    open = !open;
  }

  function onDocumentClick( evt ) {
    if( !button.contains( evt.target ) && !popover.contains( evt.target ) ) {
      open = false;
    }
  }

  function onItemClick( item ) {
    open = false;          
    if( onchange ) onchange( item.value );
  }
</script>

<label>

  <button bind:this={button} onclick={onButtonClick} type="button">
    <Icon height="20" icon="material-symbols:fork-spoon-rounded" width="20" />
    <span>{label}</span>
    <Icon height="20" icon="material-symbols:keyboard-arrow-down-rounded" width="20" />    
  </button>

  <ul bind:this={popover} class:open>
    {#each items as item}
      <li>
        <button onclick={() => onItemClick( item )} type="button">
          <span>{item.label}</span>
        </button>
      </li>
    {/each}
  </ul>

</label>

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

  label {
    justify-self: start;    
    position: relative;
  }

  label > button {
    align-items: center;
    appearance: none;
    background: #ffffff;
    border: solid 1px #00000040;
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
    -webkit-tap-highlight-color: transparent;      
  }

  label > button span {
    color: #161616;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
  }

  label > button:focus {
    border: solid 1px #0284c7;
    box-shadow: 0 0 0 3px rgb( from #0284c7 r g b / 0.40 );    
  } 

  ul {
    background: #ffffff;
    border: solid 1px #00000040;
    border-radius: 4px;
    bottom: calc( 100% + 2px );    
    box-shadow: rgba( 113, 113, 122, 0.12 ) 0px 2px 8px 0px;
    display: none;
    flex-direction: column;
    left: 0;
    list-style: none;
    margin: 0;
    padding: 4px 0 4px 0;
    position: absolute;
    width: 175px;
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
    padding: 0 12px 0 12px;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }  

  ul li button span {
    color: #161616;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    text-align: left;
  }  

  ul li button:hover {
    background: #00000010;
  }

  ul li button:hover span {
    color: #000000;
  }  
</style>
