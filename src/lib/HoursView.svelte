<script>
  import HistoryList from "$lib/HistoryList.svelte";
  import GraphSection from "./GraphSection.svelte";

  let {
    activity = null, 
    history = [], 
    levels = [], 
    onchange, 
    onsun,
    sun = null,
    volume
  } = $props();
</script>

<section>

  <header>
    <h3>Hours</h3>
  </header>

  <div>
    <GraphSection
      average={activity === null ? [] : activity.average} 
      daily={activity === null ? null : activity.daily} 
      days={7}
      {onsun}
      {sun}
      water={volume} />
  </div>    

  <article>
    <HistoryList items={history} {onchange} />
  </article>

</section>

<style>
  article {
    display: flex;
    flex-direction: column;
  }

  div {
    display: none;
  }

  article:last-of-type {
    flex-basis: 0;
    flex-grow: 1;
    overflow: hidden;
  }

  header {
    align-items: center;
    display: flex;
    flex-direction: row;
    padding: 16px 0 16px 16px;
  }

  h3 {
    color: #161616;
    cursor: default;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 32px;
    font-weight: 600;
    line-height: 36px;
    margin: 0;
    padding: 0;
  }

  section {
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;
    width: 100%;
  }

  @media( max-width: 780px ) {  
    div {
      display: flex;
      flex-direction: column;
    }

    h3 {
      display: none;
    }

    header {
      display: none;
    }

    section {
      max-width: unset;
      overflow: hidden;
    } 
  }
</style>
