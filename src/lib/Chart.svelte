<script>
  import { onMount } from "svelte";

  let {value = []} = $props(); 

  let size = $state( 0 );
  let svg = $state();

  let range = $derived.by( () => {
    const tempResult = {};
    const now = new Date();
    const todayKey = formatLocalDate(now);
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // If no history, return today with all zeros
    if (!Array.isArray(value) || value.length === 0) {
      return {
        [todayKey]: Array(24).fill(0)
      };
    }

    let minStartDate = null;

    for (const period of value) {
      const start = period.start;
      const end = period.end ? new Date(period.end) : new Date(); // null end → now

      if (!minStartDate || start < minStartDate) {
        minStartDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      }

      const startTime = new Date(start.getTime());
      startTime.setSeconds(0, 0);

      const endTime = new Date(end.getTime());
      endTime.setSeconds(0, 0);

      let current = new Date(startTime);

      while (current < endTime) {
        const dateKey = formatLocalDate(current);
        const hour = current.getHours();

        if (!tempResult[dateKey]) {
          tempResult[dateKey] = Array(24).fill(0);
        }

        const nextHour = new Date(current);
        nextHour.setMinutes(60, 0, 0);

        const segmentEnd = endTime < nextHour ? endTime : nextHour;
        const minutesCovered = Math.max(0, (segmentEnd - current) / 60000);
        const fraction = minutesCovered / 60;

        tempResult[dateKey][hour] += fraction;
        tempResult[dateKey][hour] = Math.min(tempResult[dateKey][hour], 1);

        current = new Date(segmentEnd);
      }
    }

    // Fill in missing days from minStartDate to today
    const fillDate = new Date(minStartDate);
    while (fillDate <= endDate) {
      const dateKey = formatLocalDate(fillDate);
      if (!tempResult[dateKey]) {
        tempResult[dateKey] = Array(24).fill(0);
      }
      fillDate.setDate(fillDate.getDate() + 1);
    }

    const sortedKeys = Object.keys(tempResult).sort((a, b) => b.localeCompare(a));
    const result = {};
    for (const key of sortedKeys) {
      result[key] = tempResult[key];
    }

    return result;
  } );

  onMount( () => {
    const observer = new ResizeObserver( ( entries ) => {
      for( const entry of entries ) {
        size = ( entry.contentRect.width - ( 24 * 2 ) - 65 )  / 24;
      }
    } );
    observer.observe( svg );

    return () => {
      observer.unobserve( svg );
    };
  } );

  function formatLabel( value ) {
    value = new Date( value + 'T00:00:00' );

    const formatter = new Intl.DateTimeFormat( navigator.language, {
      month: 'short',
      day: 'numeric'
    } );    
    return formatter.format( value );
  }

  function formatLocalDate( date ) {
    const y = date.getFullYear();
    const m = String( date.getMonth() + 1 ).padStart( 2, '0' );
    const d = String( date.getDate() ).padStart( 2, '0' );
    return `${y}-${m}-${d}`;
  }

  function offset( hour, status ) {
    if( hour === 0 || status[hour - 1] === 0 ) {
      return 65 + ( size * hour ) + ( hour * 2 ) + ( size * ( 1 - status[hour] ) );
    }

    return 65 + ( size * hour ) + ( hour * 2 );
  }
</script>

<article>
  <ul>
    <li style:grid-template-columns="65px {size}px 1fr 24px">
      <p>Date</p>
      <p>0</p>
      <p>12</p>
      <p>24</p>
    </li>
    {#each Object.keys( range ) as day}
      {@const status = range[day]}    
      <li>
        <svg bind:this={svg}>
          <text x="0" y="12">{formatLabel( day )}</text>
          {#each {length: 24}, hour}
            <rect fill="#00000010" x={65 + ( size * hour ) + ( hour * 2 )} y={( 24 - size ) / 2} width={size} height={size}></rect>
            {#if status[hour] !== 0}
              <rect fill="#161616" x={offset( hour, status )} y={( 24 - size ) / 2} width={size * status[hour]} height={size}></rect>
            {/if}
          {/each}
        </svg>
      </li>
    {/each}
  </ul>
  <legend>
    <div style:height="{size}px" style:width="{size}px"></div>
    <p>Fasting</p>
  </legend>
</article>  

<style>
  legend {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-end;
    margin: 0;
    padding: 4px 28px 0 0;
    width: 100%;
  }

  legend div {
    background: #161616;
  }

  legend p {
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable';
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 18px;
    margin: 0;
    padding: 0;
  }

  svg {
    box-sizing: border-box;
    flex-basis: 0;
    flex-grow: 1;
    height: 24px;
    min-width: 0;
  }

  svg text {
    cursor: default;
    fill: #161616;
    dominant-baseline: middle;
    font-family: 'Roboto Variable';
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.50px;
    text-anchor: start;    
  }

  ul {
    background: #ffffff;
    border: solid 1px #d5d5d5;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0 16px 0 16px;
    padding: 12px;
  }

  ul li {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    gap: 16px;
    margin: 0;
    padding: 0;
  }

  ul li:first-of-type {
    display: grid;
    gap: 0;
  }

  ul li:first-of-type p {
    box-sizing: border-box;
    cursor: default;
    color: #161616;
    font-family: 'Roboto Variable';
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 18px;
    margin: 0;    
    opacity: 0.40;
    padding: 0;
  }

  ul li:first-of-type p:nth-of-type( 2 ),
  ul li:first-of-type p:nth-of-type( 3 ) {
    text-align: center;
  }

  ul li:first-of-type p:nth-of-type( 4 ) {
    text-align: right;
  }  
</style>
