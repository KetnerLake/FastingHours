<script>
  import ActivityGraph from "./ActivityGraph.svelte";
  import Icon from "@iconify/svelte";
  import Select from "./Select.svelte";
  import WaterGraph from "./WaterGraph.svelte";

  let {activity = null, days = 10, onsun, sun, water = null} = $props();   

  let graph = $state( 0 );

  function formatTime( value ) {
    const formatter = new Intl.DateTimeFormat( navigator.language, {
      hour: 'numeric',
      minute: '2-digit'
    } );    
    return formatter.format( value );    
  }  
</script>

<section>

  {#if graph === 0}
    <ActivityGraph      
      average={activity && activity.average ? activity.average : []} 
      daily={activity && activity.daily ? activity.daily : []}     
      {days} />
  {:else if graph === 1}
    <WaterGraph 
      average={water && water.average ? water.average : null}
      daily={water && water.daily ? water.daily : null} />  
  {/if}

  <footer>
    <div class="daynight">
      {#if sun === null}
        <button class="sun" onclick={onsun} type="button">
          Sunrise/sunset
        </button>
      {:else}
        <Icon height="16" icon={sun && sun.icon ? sun.icon : null} width="16" />
        <p>{sun && sun.timing ? formatTime( sun.timing ) : ''}</p>
      {/if}   
    </div>    
    <Select icon="material-symbols:mode-heat-outline-rounded" label="Fasting" onchange={( value ) => graph = value}>
      <option data-icon="material-symbols:mode-heat-outline-rounded" selected value="0">Fasting</option>
      <option data-icon="material-symbols:water-drop-outline-rounded" value="1">Water</option>      
      <!-- <option data-icon="material-symbols:fork-spoon-rounded" value="2">Hunger</option> -->            
    </Select>
  </footer>

</section>

<style>
  button.sun {
    appearance: none;
    background: none;
    border: none;
    cursor: pointer;
    color: #0284c7;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    outline: none;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }  

  footer {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-end;
    margin: 0;
    max-width: 660px;
    min-width: 330px;
    padding: 8px 0 0 0;
    width: 100%;
  }

  footer p {
    box-sizing: border-box;
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 0;
  }

  footer div.daynight {
    align-items: center;
    display: flex;
    flex-basis: 0;
    flex-direction: row;
    flex-grow: 1;
    gap: 6px;
    padding: 0 0 0 64px;
  }  

  section {
    align-items: center;
    display: flex;
    flex-direction: column;
    padding: 12px 16px 12px 16px;
  }
</style>
