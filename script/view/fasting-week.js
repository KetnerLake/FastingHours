customElements.define( 'fh-fasting-week', class extends HTMLElement {
  constructor() {
    super();

    // Elements
    this.$days = this.querySelectorAll( 'li' );

    // Setup
    const locale = navigator.language || 'en-US';        
    const day = new Intl.DateTimeFormat( locale, {weekday: 'long'} );
    const date = new Intl.DateTimeFormat( locale, {month: 'short', day: 'numeric'} );
    const calendar = new Date();

    for( let d = 0; d < this.$days.length; d++ ) { 
      if( d === 0 ) {
        this.$days[d].classList.toggle( 'today' );
      }

      this.$days[d].children[0].children[0].textContent = day.format( calendar );
      this.$days[d].children[0].children[1].textContent = date.format( calendar );
      calendar.setDate( calendar.getDate() + 1 );
    }
  }
} );
