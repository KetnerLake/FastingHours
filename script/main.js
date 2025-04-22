const message = document.querySelector( 'fh-fasting-message' );
const week = document.querySelector( 'fh-fasting-week' );

const start = document.querySelector( '#start' );
start.value = window.localStorage.getItem( 'fasting_hours_start' ) || '1';
start.addEventListener( 'change', () => {
  window.localStorage.setItem( 'fasting_hours_start', start.value );
  message.build();
  week.build();
} );

const last = document.querySelector( '#last' );
last.value = window.localStorage.getItem( 'fasting_hours_last' ) || 'normal';
last.addEventListener( 'change', () => {
  window.localStorage.setItem( 'fasting_hours_last', last.value );
  message.build();
  week.build();
} );
