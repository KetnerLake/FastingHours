<script>
  import Icon from "@iconify/svelte";  
  import {onMount} from "svelte";  

  let {display = new Date(), onchange, value = new Date()} = $props();

  let month = $derived.by( () => {
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      month: 'long',
      year: 'numeric'
    } );
    return formatter.format( display );
  } );

  let days = $derived.by( () => {
    const dates = [];
    const today = new Date();  

    const calendar = new Date(
      display.getFullYear(),
      display.getMonth(),
      1
    );
    calendar.setDate( calendar.getDate() - calendar.getDay() );    
    
    for( let d = 0; d < 42; d++ ) {
      const item = {
        date: calendar.getDate(),
        month: calendar.getMonth(),
        year: calendar.getFullYear(),
        outside: true,
        today: false,
        selected: false,
        after: false
      };

      if(
        calendar.getFullYear() === display.getFullYear() &&
        calendar.getMonth() === display.getMonth()
      ) {
        item.outside = false;
      }

      if( 
        calendar.getTime() > Date.now()
      ) {
        item.after = true;
      }

      if(
        calendar.getFullYear() === today.getFullYear() &&
        calendar.getMonth() === today.getMonth() &&
        calendar.getDate() === today.getDate()
      ) {
        item.today = true;
      }

      if(
        calendar.getFullYear() === value.getFullYear() &&
        calendar.getMonth() === value.getMonth() &&
        calendar.getDate() === value.getDate()
      ) {
        item.selected = true;
      }

      calendar.setDate( calendar.getDate() + 1 );   
      dates.push( item );   
    }

    return dates;
  } );

  function onBeforeClick() {
    let month = display.getMonth();
    let year = display.getFullYear();

    year = ( month === 0 ) ? year - 1 : year;
    month = ( month === 0 ) ? 11 : month - 1;

    display = new Date(
      year,
      month,
      display.getDate()
    );
  }

  function onDayClick( evt ) {
    const selected = new Date(
      parseInt( evt.currentTarget.getAttribute( 'data-year' ) ),
      parseInt( evt.currentTarget.getAttribute( 'data-month' ) ),
      parseInt( evt.currentTarget.getAttribute( 'data-date' ) )
    );

    if( selected.getMonth() !== display.getMonth() ) {
      display = new Date( selected.getTime() );
    }

    value = new Date( selected.getTime() );

    if( onchange ) onchange( value );
  }

  function onNextClick() {
    let month = display.getMonth();
    let year = display.getFullYear();
    
    year = ( month === 11 ) ? year + 1 : year;
    month = ( month + 1 ) % 12;
    
    display = new Date(
      year,
      month,
      display.getDate()
    );
  }
</script>

<section>
  <header>
    <h3>{month}</h3>
    <button onclick={onBeforeClick} type="button">
      <Icon height="24" icon="material-symbols:navigate-before" width="24" />
    </button>    
    <button onclick={onNextClick} type="button">
      <Icon height="24" icon="material-symbols:navigate-next" width="24" />
    </button>
  </header>
  <article>
    <p>Sun</p>
    <p>Mon</p>
    <p>Tue</p>
    <p>Wed</p>
    <p>Thu</p>
    <p>Fri</p>
    <p>Sat</p>                     
  </article>
  <article>
    {#each days as day}
      <button 
        class:outside={day.outside} 
        class:today={day.today}         
        class:selected={day.selected}
        data-year={day.year} 
        data-month={day.month} 
        data-date={day.date} 
        disabled={day.after}
        onclick={onDayClick}
        type="button">
        {day.date}
      </button>
    {/each}
  </article>
</section>

<style>
  article {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    padding: 0 8px 0 8px;
  }

  button {
    align-items: center;
    appearance: none;
    background: none;
    border: none;
    border-radius: 40px;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: flex;
    font-family: 'Roboto Variable';
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 24px;
    height: 40px;
    justify-content: center;
    margin: 0;
    padding: 0;
    text-align: center;
    transition:
      background 0.15s ease-in-out,
      border 0.15s ease-in-out,
      color 0.15s ease-in-out;
    width: 40px;
    -webkit-tap-highlight-color: transparent;        
  }

  button.outside {
    color: #00000040;
  }

  button.today {
    color: #0284c7;
  }

  button.selected {
    background: #0284c740;
    color: #0284c7;
    font-weight: 600;
  }

  button[disabled] {
    background: #ffffff;
    color: #00000040;
    cursor: not-allowed;
    font-weight: 400;
  }

  header {
    align-items: center;
    display: flex;
    flex-direction: row;
    height: 40px;
    margin: 0;
    padding: 0 4px 0 12px;
  }

  header button {
    color: #0284c7;
    height: 40px;
  }

  h3 {
    color: #161616;
    cursor: default;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.10px;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }

  p {
    box-sizing: border-box;
    cursor: default;
    color: #00000040;
    font-family: 'Roboto Variable';
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 20px;
    margin: 0;
    padding: 10px 0 10px 0;
    text-align: center;
    text-transform: uppercase;
    width: 40px;
  }
</style>
