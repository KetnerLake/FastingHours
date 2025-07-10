<script>
  let {onchange, value = []} = $props();

  let data = $derived.by( () => {
    const copy = [... value];
    return copy.sort( ( a, b ) => {
      if( a.start.getTime() > b.start.getTime() ) return -1;
      if( a.start.getTime() < b.start.getTime() ) return 1;
      return 0;      
    } );
  } );

  function onRowClick( evt ) {
    const id = evt.currentTarget.getAttribute( 'data-id' );
    if( onchange ) onchange( id );
  }

  function formatLabel( date ) {
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    } );    
    return formatter.format( date );  
  }
</script>

<article>
  <header>
    <p>Start time</p>
    <p>End time</p>
  </header>
  <ul>
    {#each data as item}
    <li>
      {#if item.end} 
        <button data-id={item.id} onclick={onRowClick} type="button">
          <p>{formatLabel( item.start )}</p>
          <p>{item.end === null ? '-' : formatLabel( item.end )}</p>      
        </button>      
      {:else}
        <p>{formatLabel( item.start )}</p>
        <p>{item.end === null ? '-' : formatLabel( item.end )}</p>
      {/if}
    </li>
    {/each}
  </ul>  
</article>

<style>
  article {
    padding: 16px;
  }

  header {
    display: flex;
    flex-direction: row;
  }

  header p {
    color: #161616;
    cursor: default;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable';
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.50px;
    line-height: 32px;
    margin: 0;
    padding: 0 16px 0 16px;
  }  

  ul {
    background: #ffffff;
    border: solid 1px #d5d5d5;
    border-radius: 4px;
    box-sizing: border-box;
    flex-basis: 0;
    flex-grow: 1;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul li {
    border-bottom: solid 1px #d5d5d5;    
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
  }

  ul li:last-of-type {
    border-bottom: solid 1px transparent;
  }

  li button {
    appearance: none;
    background: none;
    border: none;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    margin: 0;
    outline: none;
    padding: 0;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }

  ul li p {
    color: #161616;
    cursor: pointer;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable';
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 39px;
    margin: 0;
    padding: 0 16px 0 16px;    
    text-align: left;
  }

  ul li > p {
    cursor: default;
  }
</style>
