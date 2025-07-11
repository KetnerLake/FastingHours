<script>
  import "@fontsource-variable/roboto";  
  import { onMount } from "svelte";
  import { Database } from "$lib/Database.svelte.js";
  import Icon from "@iconify/svelte";

  let db = new Database();
  let interval = null;

  let fasting = $state( false );
  let start = $state( null );
  let now = $state( null );

  let duration = $derived.by( () => {
    if( now === null || start === null ) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    }

    const difference = Math.floor( ( now - start.getTime() ) / 1000 );
    
    return {
      hours: Math.floor( difference / 3600 ).toString( 10 ).padStart( 2, '0' ),
      minutes: Math.floor( ( difference % 3600 ) / 60 ).toString( 10 ).padStart( 2, '0' ),
      seconds: ( difference % 60 ).toString( 10 ).padStart( 2, '0' ) 
    };
  } );

  let formatted = $derived.by( () => {
    if( start === null ) return null;

    const formatter = new Intl.DateTimeFormat( navigator.language, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    } );

    return formatter.format( start );
  } );

  onMount( () => {
    const active = window.localStorage.getItem( 'fh_active' );
    const started = window.localStorage.getItem( 'fh_start' );

    if( active === null ) {
      fasting = false;
    } else {
      fasting = parseInt( active ) === 0 ? false : true;
    }

    if( fasting ) {
      now = Date.now();

      if( started === null ) {
        window.localStorage.setItem( 'fh_start', Date.now() );
        start = new Date();
      } else {
        start = new Date( parseInt( started ) );
      }

      interval = setInterval( () => {
        now = Date.now();
      }, 1000 );      
    }
  } );

  function onFastingClick() {
    fasting = !fasting;
    window.localStorage.setItem( 'fh_active', fasting ? 1 : 0 );

    if( fasting ) {
      now = Date.now();
      start = new Date();
      window.localStorage.setItem( 'fh_start', start.getTime() );
      db.add( {start: new Date( start.getTime() ), end: null, notes: null} );

      interval = setInterval( () => {
        now = Date.now();
      }, 1000 );
    } else {
      now = null;
      start = null;
      window.localStorage.removeItem( 'fh_start' );
      db.browseByEnd().then( ( data ) => {
        data.end = new Date();
        return db.edit( data );
      } );

      clearInterval( interval );
      interval = null;      
    }
  }
</script>

<section>
  <header>
    <h1>Fasting Hours</h1>
    <a href="/history">
      <Icon height="20" icon="material-symbols:insert-chart-outline-rounded" width="20" />
      <span>History</span>      
    </a>
  </header>
  <article>
    {#if fasting}
      <h3>You are fasting.</h3>
      <div>
        <p>{duration.hours}<span>hrs</span></p>
        <p>:</p>
        <p>{duration.minutes}<span>min</span></p>
        <p>:</p>      
        <p>{duration.seconds}<span>sec</span></p>
      </div>
      <p class="small">Started {formatted}</p>
    {:else}
      <h3>You are not fasting.</h3>
    {/if}

    <button 
      onclick={onFastingClick} 
      type="button">
      {fasting ? 'Stop' : 'Start'} fasting
    </button>
  </article>
  <footer>
    <p>Made with ❤️ by <a href="http://kevinhoyt.com">Kevin Hoyt</a>.</p>
  </footer>
</section>

<section>
  <h1>What is this?</h1>
  <p>It is a fasting timer, duh! 😜 Actually, that is about all it is.</p> 
  <p>Fasting Hours was born out of my desire for a simple fasting timer. No application to install. No subscription fees for features I never wanted. No notifications about integrations and sales. No selling my email address into the spam void.</p>
  <p>If you click on that "Start fasting" button, I will never know it. You will not get charged any fees. I do not have your email. I do not want your email. Your fasting history, your data, stays on your device.</p>
  <p>But then maybe I am getting ahead of myself...</p>

  <h1>Why is this?</h1>
  <p>Fasting is a dietary technique to lose and/or maintain body weight. There are myriad approaches, but the basics to fasting are simple: do not eat for a given period of time. You might go 40 hours (alternate day fasting) without eating. Or perhaps 16 hours is more your speed (16:8).</p>
  <p>It is that passage of time that makes timers a useful motivational tool.</p> 
  <p>When hunger seems to be overwhelming, you can see how much time you have until you hit your desired target. Maybe you take a step back and drink some water. Maybe you take the moment to reflect on any emotions that might be driving your hunger. Seeing the time on the screen. Knowing where you are in the fight. Knowing that it is being tracked. Seeing consistency emerge to prove to yourself that you can do it.</p>
  <p>Having the timer helps me. I hope it helps you, too.</p>

  <h1>Who are you?</h1>
  <p>My name is Kevin Hoyt. I have been a software developer for almost 30 years (remote for 25 years of that time). I like to build tools that solve my problems. For me, weight is and has been a problem. My wife and I live in the Denver, CO area. I tend to quote pop culture references far more than I should (based on the confused looks I often get in return). 😂</p>
  <p>I update Fasting Hours on a semi-regular basis. Whenever I have feature ideas that I want to explore. Or whenever one of you have feature ideas you want me to explore. If that is the case, feel free to reach out (I do not bite) on <a href="https://bsky.app/profile/krhoyt.bsky.social">Bluesky</a>.</p>
</section>

<style>
  :global( html ) {
    height: 100%;
  }

  :global( body ) {
    align-items: center;
    background: #f8f8f8;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  a {
    color: #0082ff;
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    text-decoration: none;
  }

  article {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    gap: 16px;
    justify-content: center;
  }  

  button {
    align-items: center;
    appearance: none;
    background: #161616;
    border: none;
    border-radius: 40px;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    height: 40px;
    justify-content: center;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    outline: none;
    padding: 0 16px 0 16px;
    -webkit-tap-highlight-color: transparent;    
  }

  div {
    display: flex;
    flex-direction: row;
  }

  div span {
    display: block;
  }

  footer {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 48px;
    justify-content: center;
    margin: 0;
    padding: 0 16px 0 16px;
    width: 100%;
  }

  h1 {
    color: #161616;
    cursor: default;
    flex-basis: 0;
    flex-grow: 1;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 22px;
    font-weight: 400;
    line-height: 28px;
    margin: 0;
    padding: 0 0 0 12px;
    text-align: left;
  }  

  h3 {
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    margin: 0;
    padding: 0;
  }  

  header {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 64px;
    padding: 0 4px 0 4px;
    width: 100%;
  }

  header a {
    align-items: center;
    background: none;
    display: flex;
    font-family: 'Roboto Variable';
    font-size: 14px;
    font-weight: 500;
    gap: 8px;
    letter-spacing: 0.10px;
    line-height: 20px;
    height: 40px;
    justify-content: center;
    margin: 0 12px 0 0;
    padding: 0;    
  }

  p {
    box-sizing: border-box;
    color: #161616;
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0.50px;
    line-height: 24px;
    margin: 0;
    padding: 0;
    text-align: center;
  }

  p.small {
    font-size: 12px;
    opacity: 0.40;
  }  

  section:first-of-type {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    min-height: 100%;
    max-width: 430px;
    width: 100vw;
  }

  section:last-of-type {
    box-sizing: border-box;
    max-width: 430px;
    padding: 16px;
    width: 100vw;
  }  

  section:last-of-type h1 {   
    margin-bottom: 16px;
    padding: 0;
  }

  section:last-of-type p {     
    margin-bottom: 16px;
    text-align: left;
  }

  div p {
    font-size: 48px;
    font-weight: 600;
    line-height: 48px;
    text-align: right;
  }

  div span {
    font-size: 20px;
    line-height: 20px;
  }  

  div p:nth-of-type( 2 ),
  div p:nth-of-type( 4 ) {
    padding: 0 8px 0 8px;
  }
</style>
