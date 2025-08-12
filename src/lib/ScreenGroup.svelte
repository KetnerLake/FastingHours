<script>
  let {onchange, value = 0} = $props();

  function onFastingClick() {
    if( value !== 0 ) {
      value = 0;
      if( onchange ) onchange( value );
    }
  }

  function onHoursClick() {
    if( value !== 1 ) {
      value = 1;
      if( onchange ) onchange( value );
    }
  }  
</script>

<ul>
  <li>
    <button 
      class="fasting" 
      class:selected={value === 0 ? true : false} 
      onclick={onFastingClick} 
      type="button">
      Fasting
    </button>
  </li>
  <li>
    <button 
      class="hours" 
      class:selected={value === 1 ? true : false} 
      onclick={onHoursClick} 
      type="button">
      Hours
    </button>  
  </li>
</ul>

<style>
  button {
    appearance: none;
    background: none;
    border: solid 1px #00000040;    
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    height: 40px;
    margin: 0;
    outline: none;
    padding: 0 16px 0 16px;
    transition:
      background 0.15s ease-in-out,
      border 0.15s ease-in-out,
      color 0.15s ease-in-out;
    -webkit-tap-highlight-color: transparent;
  }

  button.fasting {
    border-bottom-left-radius: 4px;    
    border-bottom-right-radius: 0;    
    border-right: none;    
    border-top-left-radius: 4px;
    border-top-right-radius: 0;
  }

  button.hours {
    border-bottom-left-radius: 0;    
    border-bottom-right-radius: 4px;    
    border-left: none;
    border-top-left-radius: 0;
    border-top-right-radius: 4px;
  }

  button.selected {
    background: #0284c7;
    border: solid 1px #0284c7;
    color: #ffffff;
    font-weight: 500;
  }

  ul {
    display: flex;
    flex-direction: row;
    justify-self: center;
    list-style: none;
    margin: 0;
    opacity: var( --radio-group-opacity, 1.0 );
    transition: opacity 0.30s ease-in-out;
    padding: 0;
  }
</style>
