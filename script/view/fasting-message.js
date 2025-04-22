customElements.define( 'fh-fasting-message', class extends HTMLElement {
  constructor() {
    super();

    // Elements
    this.$message = this.querySelector( 'h3' );
    this.build();
  }

  build() {
    const last = window.localStorage.getItem( 'fasting_hours_last' ) || 'normal';
    const start = window.localStorage.getItem( 'fasting_hours_start' ) === null ? 1 : parseInt( window.localStorage.getItem( 'fasting_hours_start' ) );    
    
    const calendar = new Date();
    calendar.setDate( calendar.getDate() - calendar.getDay() );

    if( start % 2 === 1 ) {
      this.$message.innerHTML = '<span>Eat</span> normally today.';        
    } else {
      this.$message.innerHTML = 'Today is a <span>fasting</span> day.';
    }

    if( calendar.getDay() === 6 ) {
      switch( last ) {
        case 'omad':
          this.$message.innerHTML = 'Eat <span>one meal</span> today.';        
          break;
        case 'fasting':
          this.$message.innerHTML = 'Today is a <span>fasting</span> day.';
          break;
        case 'normal':
          this.$message.innerHTML = '<span>Eat</span> normally today.';        
          break;
        case 'i16':
          this.$message.innerHTML = 'Eat between <span>12PM and 8PM.</span>';        
          break;
      } 
    }
  }
} );
