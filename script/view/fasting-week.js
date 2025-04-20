customElements.define( 'fh-fasting-week', class extends HTMLElement {
  constructor() {
    super();

    // Elements
    this.$week = this.querySelector( 'ul' );

    // Setup
    const locale = navigator.language || 'en-US';        
    const day = new Intl.DateTimeFormat( locale, {weekday: 'long'} );
    const date = new Intl.DateTimeFormat( locale, {month: 'short', day: 'numeric'} );
    const calendar = new Date();
    const today = new Date();

    for( let d = 0; d < 7; d++ ) {
      const day_of_year = this.dayOfYear( calendar );
      const template = document.querySelector( '#fasting-day' );
      const clone = template.content.cloneNode( true );      

      const content = clone.querySelectorAll( 'p' );
      content[0].textContent = day.format( calendar );
      content[1].textContent = date.format( calendar );    
      content[2].innerHTML = day_of_year % 2 === 0 ? 'Eat normally' : '24-hour fast <span>or</span> Eat less than<br>500 calories';

      if( calendar.getFullYear() === today.getFullYear() &&
          calendar.getMonth() === today.getMonth() &&
          calendar.getDate() === today.getDate() ) {
        clone.firstElementChild.classList.add( 'today' );
      } else {
        clone.firstElementChild.classList.remove( 'today' );
      }

      this.$week.appendChild( clone ); 
      
      calendar.setDate( calendar.getDate() + 1 );
    }
  }

  dayOfYear( now = new Date() ) {
    const start = new Date( now.getFullYear(), 0, 0 );
    const diff = now - start + ( start.getTimezoneOffset() - now.getTimezoneOffset() ) * 60 * 1000;
    const day = 1000 * 60 * 60 * 24;
    return Math.floor( diff / day );
  } 
} );
