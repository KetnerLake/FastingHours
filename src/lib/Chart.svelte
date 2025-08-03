<script>
  let {history = []} = $props(); 

  let interval = null;

  let range = $derived.by( () => {
    const tempResult = {};
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startLimitDate = new Date(endDate);
    startLimitDate.setDate(endDate.getDate() - 9); // 10 days including today

    // --- Step 1: Fill tempResult with activity or zeros ---
    if (!Array.isArray(history) || history.length === 0) {
      const date = new Date(startLimitDate);
      while (date <= endDate) {
        const key = formatLocalDate(date);
        tempResult[key] = Array(24).fill(0);
        date.setDate(date.getDate() + 1);
      }
    } else {
      for (const fast of history) {
        const start = new Date(fast.started);
        const end = fast.ended ? new Date(fast.ended) : new Date();

        const startTime = new Date(start.getTime());
        startTime.setSeconds(0, 0);
        const endTime = new Date(end.getTime());
        endTime.setSeconds(0, 0);

        let current = new Date(startTime);

        while (current < endTime) {
          const dateKey = formatLocalDate(current);
          const dateOnly = new Date(current.getFullYear(), current.getMonth(), current.getDate());

          if (dateOnly >= startLimitDate && dateOnly <= endDate) {
            const hour = current.getHours();
            if (!tempResult[dateKey]) {
              tempResult[dateKey] = Array(24).fill(0);
            }
            tempResult[dateKey][hour] += 1; // one minute of activity
          }

          current.setMinutes(current.getMinutes() + 1);
        }
      }

      // Convert to fractional hours (max 1 per hour)
      for (const date in tempResult) {
        tempResult[date] = tempResult[date].map(mins => +(Math.min(mins, 60) / 60).toFixed(6));
      }

      // Ensure full 10-day range is covered
      const fillDate = new Date(startLimitDate);
      while (fillDate <= endDate) {
        const key = formatLocalDate(fillDate);
        if (!tempResult[key]) {
          tempResult[key] = Array(24).fill(0);
        }
        fillDate.setDate(fillDate.getDate() + 1);
      }
    }

    // --- Step 2: Sort dates in descending order ---
    const sortedKeys = Object.keys(tempResult).sort((a, b) => b.localeCompare(a));
    const dailyActivity = {};
    for (const key of sortedKeys) {
      dailyActivity[key] = tempResult[key];
    }

    // --- Step 3: Compute average hourly activity ---
    const hourTotals = Array(24).fill(0);
    for (const hour of Array(24).keys()) {
      for (const date of sortedKeys) {
        hourTotals[hour] += dailyActivity[date][hour];
      }
    }

    const averageHourlyActivity = hourTotals.map(total => +(total / 10).toFixed(6));

    // --- Final result ---
    return {
      daily: dailyActivity,
      averages: averageHourlyActivity
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
      return ( ( 1 - status[hour] ) * 100 ) + '%';
    }

    return 0;
  }
</script>

<figure>

  <div class="labels">
    <p class="date">Date</p>
    <p class="hour">0</p>
    <p class="hour">12</p>
    <p class="hour">24</p>
  </div>    

  <div class="grid">
    {#each Object.keys( range.daily ) as day}
      {@const status = range.daily[day]}        
      <p class="day">{formatLabel( day )}</p>
      {#each {length: 24}, hour}
        <div class="day">
          {#if status[hour] !== 0}
            <div 
              class="hour" 
              style:margin-left={offset( hour, status )} 
              style:width={( 100 * status[hour] ) + '%'}>
            </div>          
          {/if}          
        </div>
      {/each}
    {/each}
  </div>

  <div class="average grid">
    <p class="day">Avg</p>
    {#each {length: 24}, hour}      
      <div class="day">
        <div class="hour" style:opacity={range.averages[hour]} style:width="100%"></div>
      </div>      
    {/each}      
  </div>

  <legend>
    <div></div>
    <p>Fasting</p>
  </legend>

</figure>

<style>
  div.day {
    background: #00000010;
    border-radius: 3px;
    box-sizing: border-box;
    flex-basis: 0;
    flex-grow: 1;
    height: 24px;
    overflow: hidden;
  }  

  div.grid {
    box-sizing: border-box;
    display: grid;
    gap: 2px;
    grid-template-columns: 62px repeat( 24, 1fr );    
    width: 100%;    
  }

  div.average.grid {
    padding: 8px 0 0 0;
  }

  div.hour {
    background: #52525b;
    height: 24px;
    margin: 0;
  }

  div.labels {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 62px repeat( 3, 1fr );    
    padding: 0 0 2px 0;
    width: 100%;    
  }  

  figure {
    align-self: center;
    box-sizing: border-box;
    margin: 0;
    max-width: 685px;
    min-width: 330px;
    padding: 16px;
    width: 100%;
  }

  legend {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-end;
    margin: 0;
    padding: 8px 4px 0 0;
    width: 100%;
  }

  legend p {
    box-sizing: border-box;
    color: #161616;
    cursor: defaut;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 0;
  }

  legend div {
    background: #52525b;
    border-radius: 3px;
    box-sizing: border-box;
    display: inline;
    min-height: 16px;
    min-width: 16px;
  }

  p.day {
    box-sizing: border-box;
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 2px 0 2px 0;
    white-space: nowrap;
  }

  p.hour,
  p.date {
    box-sizing: border-box;
    color: #00000040;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 0;
    width: 62px;
  }  

  p.date {
    text-align: left;
  }

  p.hour:nth-of-type( 2 ) {
    padding: 0 0 0 2px;
  }

  p.hour:nth-of-type( 3 ) {
    justify-self: center;
    text-align: center;
  }

  p.hour:last-of-type {
    justify-self: end;
    padding: 0 4px 0 0;
    text-align: right;
  }
</style>
