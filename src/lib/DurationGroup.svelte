<script>
  import Icon from "@iconify/svelte";

  let {onchange, value = 0} = $props();

  function onDurationClick( duration ) {
    value = duration;
    if( onchange ) onchange( value );
  }
</script>

<div>
  <button class:selected={value === 0 ? true : false} onclick={() => onDurationClick( 0 )} type="button">
    <Icon height="20" icon="stash:infinity-duotone" width="20" />
  </button>                        
  <button class:selected={value === 14 ? true : false} onclick={() => onDurationClick( 14 )} type="button">14h</button>                
  <button class:selected={value === 16 ? true : false} onclick={() => onDurationClick( 16 )} type="button">16h</button>        
  <button class:selected={value === 23 ? true : false} onclick={() => onDurationClick( 23 )} type="button">23h</button>        
  <button class:selected={value === 40 ? true : false} onclick={() => onDurationClick( 40 )} type="button">40h</button>                  
</div>

<style>
  button {
    align-items: center;
    appearance: none;
    background: #ffffff;
    border: none;
    border-bottom: solid 1px #00000040;    
    border-right: solid 1px #00000040;        
    border-top: solid 1px #00000040;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: inline-flex;
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
    padding: 0;
    width: 40px;
    -webkit-tap-highlight-color: transparent;    
  }
  
  button:first-of-type {
    border-bottom-left-radius: 4px;    
    border-top-left-radius: 4px;
    border-left: solid 1px #00000040;        
  }

  button:last-of-type {
    border-bottom-right-radius: 4px;    
    border-top-right-radius: 4px;
  }

  button.selected {
    background: #0284c7;
    border-bottom: solid 1px #0284c7;    
    border-right: solid 1px #0284c7;        
    border-top: solid 1px #0284c7;    
    color: #ffffff;
    font-weight: 500;
  }

  button.selected:first-of-type {
    border-bottom-left-radius: 4px;    
    border-top-left-radius: 4px;
    border-left: solid 1px #0284c7;        
  }

  div {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
  }  
</style>
