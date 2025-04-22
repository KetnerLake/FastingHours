customElements.define( 'fh-fasting-week', class extends HTMLElement {
  constructor() {
    super();

    // Elements
    this.$week = this.querySelector( 'ul' );
    this.build();
  }
  
  build() {
    while( this.$week.children.length > 0 ) {
      this.$week.removeChild( this.$week.firstElementChild );
    }

    const last = window.localStorage.getItem( 'fasting_hours_last' ) || 'normal';
    const start = window.localStorage.getItem( 'fasting_hours_start' ) === null ? 1 : parseInt( window.localStorage.getItem( 'fasting_hours_start' ) );    
    const locale = navigator.language || 'en-US';        
    const day = new Intl.DateTimeFormat( locale, {weekday: 'long'} );
    const date = new Intl.DateTimeFormat( locale, {month: 'short', day: 'numeric'} );
    const calendar = new Date();
    calendar.setDate( calendar.getDate() - calendar.getDay() );
    const today = new Date();

    let index = 0;

    while( this.$week.children.length < 7 ) {
      if( calendar.getDay() < today.getDay() ) { 
        calendar.setDate( calendar.getDate() + 1 );
        index = index + 1;
        continue;
      }

      const template = document.querySelector( '#fasting-day' );
      const clone = template.content.cloneNode( true );      

      const content = clone.querySelectorAll( 'p' );
      content[0].textContent = day.format( calendar );
      content[1].textContent = date.format( calendar );    

      if( ( index + start ) % 2 === 1 ) {
        content[2].className = 'normal'
        content[2].innerHTML = 'Eat normally';        
      } else {
        content[2].className = 'fasting';
        content[2].innerHTML = '24-hour fast <span>(&lt; 500 calories)</span>';
      }

      if( calendar.getDay() === 6 ) {
        content[2].className = last;

        switch( last ) {
          case 'omad':
            content[2].innerHTML = 'One meal <span>(end by 8PM)</span>';        
            break;
          case 'fasting':
            content[2].innerHTML = '24-hour fast <span>(&lt; 500 calories)</span>';
            break;
          case 'normal':
            content[2].innerHTML = 'Eat normally';        
            break;
          case 'i16':
            content[2].innerHTML = '16-hour fast <span>(eat 12PM - 8PM)</span>';        
            break;
        } 
      }

      if( calendar.getFullYear() === today.getFullYear() &&
          calendar.getMonth() === today.getMonth() &&
          calendar.getDate() === today.getDate() ) {
        clone.firstElementChild.classList.add( 'today' );
      } else {
        clone.firstElementChild.classList.remove( 'today' );
      }

      this.$week.appendChild( clone ); 
      
      index = index + 1;      
      calendar.setDate( calendar.getDate() + 1 );
    }    
  }
} );
