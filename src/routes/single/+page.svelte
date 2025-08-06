<script>
  let screen = $state( 'fasting' );
</script>

<main>

  <header>
      <button data-view="fasting" onclick={() => screen = 'fasting'}>Fasting</button>
      <button data-view="hours" onclick={() => screen = 'hours'}>Hours</button>    
  </header>
  
  <section data-screen={screen}>
    <article id="fasting">Fasting</article>
    <article id="hours">Hours</article>
  </section>

</main>

<style>
:global( * ) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:global( body, html ) {
  height: 100%;
  font-family: sans-serif;
}

main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

header {
  align-items: center;
  background-color: #5fb2ff;  
  display: none;
  flex-direction: row;
  justify-content: center;
  padding: 1rem;
}

section {
  display: flex;
  flex-basis: 0;
  flex-direction: row;  
  flex-grow: 1;  
  height: 100%;
  overflow: hidden;
}

section article {
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

#fasting {
  max-width: 330px;  
  overflow-y: hidden;
}

#hours {
  background-color: #f5f5f5;  
  border-left: 1px solid #ccc;    
  overflow-y: auto;    
}

/* ----- TABLET PORTRAIT or PHONE LANDSCAPE: 481px–768px ----- */
@media (max-width: 990px) {
   /* ----- Only TWO ? ----- */
}

/* ----- PHONE (portrait or small devices): 0–480px ----- */
@media( max-width: 660px ) {
  header {
    display: flex;
  }

  section {
    flex-direction: column;
  }  

  #hours {
    border-left: none;
  }

  section[data-screen=fasting] #fasting {
    display: flex;
  }

  section[data-screen=fasting] #hours {
    display: none;
  }

  section[data-screen=hours] #fasting {
    display: none;
  }    

  section[data-screen=hours] #hours {
    display: flex;
  }      
}
</style>
