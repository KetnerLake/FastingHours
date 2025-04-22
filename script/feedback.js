const home = document.querySelector( '#home' );
home.addEventListener( 'click', () => window.location.href = '/index.html' );

const send = document.querySelector( '#send' );
send.addEventListener( 'click', () => {
  const name = document.querySelector( '#name' );
  const email = document.querySelector( '#email' );
  const message_type = document.querySelector( '#message-type' );
  const message = document.querySelector( '#message' );

  if( name.value === '' || email.value === '' || message.value === '' ) {
    alert( 'Please fill out all fields.' );
    return;
  }

  fetch( '/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `${name.value} (${email.value}) - ${message_type.value}:<br>${message.value}`
    } )
  } )
  .then( () => {
    name.value = '';
    email.value = '';
    message_type.value = 'question';
    message.value = '';
    alert( 'Thank you for your feedback!' );
  } );
} );
