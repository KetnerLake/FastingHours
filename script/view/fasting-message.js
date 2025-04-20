customElements.define( 'fh-fasting-message', class extends HTMLElement {
  constructor() {
    super();

    // Elements
    this.$message = this.querySelector( 'h3' );

    // Setup
    const day = this.dayOfYear();    
    if( ( day % 2 ) === 0 ) {
      this.$message.innerHTML = '<span>Eat</span> normally today.';      
    } else {
      this.$message.innerHTML = 'Today is a <span>fasting</span> day.';      
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
