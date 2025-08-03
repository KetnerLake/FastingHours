<script>
  import About from "$lib/view/About.svelte";  
  import Fasting from "$lib/view/Fasting.svelte";
  import Hours from "$lib/view/Hours.svelte";
  import Icon from "@iconify/svelte";
  import Opener from "$lib/control/Opener.svelte";  
  import RadioGroup from "$lib/control/RadioGroup.svelte";
 
  let about = $state();
  let levels = $state( [
    {value: 1, label: 'Starving'}, 
    {value: 2, label: 'Very hungry'}, 
    {value: 3, label: 'Pretty hungry'}, 
    {value: 4, label: 'Snacky'}, 
    {value: 5, label: 'Satisfied'},
    {value: 6, label: 'Slightly full'},
    {value: 7, label: 'Uncomfortable'},
    {value: 8, label: 'Stuffed'},
    {value: 9, label: 'Stomach aches'},
    {value: 10, label: 'Sick'}
  ] );    
  let selected = $state( 0 );

  function onAboutClick() {
    about.showModal();
  }
</script>

<main>

  <header>
    <span></span>
    <RadioGroup onchange={( evt ) => selected = evt} {selected} />
    <button onclick={onAboutClick} type="button">
      <Icon height="20" icon="material-symbols:question-mark-rounded" width="20" />
    </button>
  </header>

  {#if selected === 0}
    <Fasting {levels} />
  {:else}
    <Hours {levels} />
  {/if}

</main>

<About bind:this={about} />

<style>
  :global( html ) {
    height: 100%;
  }

  :global( body ) {
    background: #ffffff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  button {
    align-items: center;
    appearance: none;
    background: none;
    border: solid 1px #00000040;
    border-radius: 40px;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    justify-self: end;
    margin: 0;
    outline: none;
    padding: 0;
    width: 40px;
    -webkit-tap-highlight-color: transparent;
  }  

  header {
    box-sizing: border-box;
    display: grid;
    grid-template-columns: 44px 1fr 44px;
    padding: 16px 12px 0 12px;
    width: 100%;
  }

  main {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-basis: 0;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    margin: 0;
    padding: 0;    
  }
</style>

<!--
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
-->
