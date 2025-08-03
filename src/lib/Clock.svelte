<script>
  import Icon from "@iconify/svelte";

  let {onchange, value = new Date()} = $props();

  let hour = $derived( value.getHours() % 12 || 12 );
  let minute = $derived( value.getMinutes().toString( 10 ).padStart( 2, '0' ) );
  let meridian = $derived( value.getHours() >= 12 ? 'PM': 'AM' );

  function onHourDecrement() {
    const time = new Date( value.getTime() );

    if( time.getHours() >= 12 ) {
      if( time.getHours() === 12 ) {
        time.setHours( 23 );
      } else {
        time.setHours( time.getHours() - 1 );
      }
    } else {
      if( time.getHours() === 0 ) {
        time.setHours( 11 );
      } else {
        time.setHours( time.getHours() - 1 );
      }      
    }

    value = new Date( time.getTime() );
    if( onchange ) onchange( value );
  }

  function onHourIncrement() {
    const time = new Date( value.getTime() );

    if( time.getHours() >= 12 ) {
      if( time.getHours() === 23 ) {
        time.setHours( 12 );
      } else {
        time.setHours( time.getHours() + 1 );
      }
    } else {
      if( time.getHours() === 11 ) {
        time.setHours( 0 );
      } else {
        time.setHours( time.getHours() + 1 );
      }      
    }

    value = new Date( time.getTime() );
    if( onchange ) onchange( value );    
  }

  function onMeridianAM() {
    const time = new Date( value.getTime() );    

    if( time.getHours() >= 12 ) {
      time.setHours( time.getHours() - 12 );
    }

    value = new Date( time.getTime() );
    if( onchange ) onchange( value );    
  }

  function onMeridianPM() {
    const time = new Date( value.getTime() );    

    if( time.getHours() < 12 ) {
      time.setHours( time.getHours() + 12 );
    }

    value = new Date( time.getTime() );
    if( onchange ) onchange( value );    
  }  

  function onMinuteDecrement() {
    const time = new Date( value.getTime() );
    
    if( time.getMinutes() === 0 ) {
      time.setMinutes( 59 );
    } else {
      time.setMinutes( time.getMinutes() - 1 );
    }

    value = new Date( time.getTime() );
    if( onchange ) onchange( value );    
  }

  function onMinuteIncrement() {
    const time = new Date( value.getTime() );
    
    if( time.getMinutes() === 59 ) {
      time.setMinutes( 0 );
    } else {
      time.setMinutes( time.getMinutes() + 1 );
    }

    value = new Date( time.getTime() );
    if( onchange ) onchange( value );    
  }
</script>

<article>
  <div class="time">
    <div class="dial">
      <button onclick={onHourIncrement} type="button">
        <Icon height="24" icon="material-symbols:keyboard-arrow-up-rounded" width="24" />
      </button>
      <p>{hour}</p>
      <button onclick={onHourDecrement} type="button">
        <Icon height="24" icon="material-symbols:keyboard-arrow-down-rounded" width="24" />
      </button>    
    </div>
    <p>:</p>
    <div class="dial">
      <button onclick={onMinuteIncrement} type="button">
        <Icon height="24" icon="material-symbols:keyboard-arrow-up-rounded" width="24" />
      </button>
      <p>{minute}</p>
      <button onclick={onMinuteDecrement} type="button">
        <Icon height="24" icon="material-symbols:keyboard-arrow-down-rounded" width="24" />
      </button>    
    </div>  
  </div>
  <div class="meridian">
    <button class:selected={meridian === 'AM' ? true : false} onclick={onMeridianAM} type="button">AM</button>
    <button class:selected={meridian === 'PM' ? true : false} onclick={onMeridianPM} type="button">PM</button>    
  </div>
</article>

<style>
  article {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    height: 320px;
    justify-content: center;
  }

  div.dial {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 96px;
  }

  button {
    touch-action: manipulation;
  }

  div.dial button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: #0284c7;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    margin: 0;
    outline: none;
    padding: 0;
    width: 96px;
    -webkit-tap-highlight-color: transparent;
  }

  div.dial button:first-of-type {
    border-left: solid 1px #00000040;
    border-right: solid 1px #00000040;    
    border-top: solid 1px #00000040;    
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;    
  }

  div.dial button:last-of-type {
    border-bottom: solid 1px #00000040;        
    border-left: solid 1px #00000040;
    border-right: solid 1px #00000040;    
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;    
  }

  div.dial > p {
    border: solid 1px #00000040;
    box-sizing: border-box;
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable';
    font-size: 57px;
    font-weight: 500;
    height: 96px;
    letter-spacing: -0.25px;
    line-height: 96px;
    margin: 0;
    padding: 0;
    text-align: center;
    width: 96px;
  }

  div.meridian {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 0 0 12px;
  }

  div.meridian button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: flex;
    font-family: 'Roboto Variable';
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.15px;
    height: 48px;
    justify-content: center;
    margin: 0;
    outline: none;
    padding: 0;
    transition:
      background 0.15s ease-in-out,
      color 0.15s ease-in-out;
    width: 52px;
    -webkit-tap-highlight-color: transparent;
  }

  div.meridian button:first-of-type {
    border-left: solid 1px #00000040;
    border-right: solid 1px #00000040;    
    border-top: solid 1px #00000040;    
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  div.meridian button:last-of-type {
    border: solid 1px #00000040;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }  

  div.meridian button.selected {
    background: #00000010;
    color: #0284c7;
  }

  div.time {
    display: flex;
    flex-direction: row;
  }

  div.time > p {
    box-sizing: border-box;
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable';
    font-size: 57px;
    font-weight: 500;    
    line-height: 96px;
    margin: 0;
    padding: 40px 0 40px 0;
    text-align: center;
    width: 24px;
  }
</style>
