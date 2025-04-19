customElements.define( 'fh-fasting-day', class extends HTMLElement {
  constructor() {
    super();

    // Elements
    this.$messages = this.querySelectorAll( 'h3' );

    // Setup
    const day = this.dayOfYear();    
    if( ( day % 2 ) === 0 ) {
      this.$messages[0].setAttribute( 'hidden', '' );
      this.$messages[1].removeAttribute( 'hidden' );
    } else {
      this.$messages[0].removeAttribute( 'hidden' );
      this.$messages[1].setAttribute( 'hidden', '' );      
    }
  }

  dayOfYear() {
    const now = new Date();
    const start = new Date( now.getFullYear(), 0, 0 );
    const diff = now - start + ( start.getTimezoneOffset() - now.getTimezoneOffset() ) * 60 * 1000;
    const day = 1000 * 60 * 60 * 24;
    return Math.floor( diff / day );
  }
} );
