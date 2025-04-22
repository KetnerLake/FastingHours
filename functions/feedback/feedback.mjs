import {Resend} from 'resend';

export default async ( request, context ) => {
  try {
    const body = await request.json();

    const resend = new Resend( process.env.RESEND_API_KEY );
    const response = await resend.emails.send( {
      from: 'Fasting Hours <feedback@flavorawesome.com>',
      to: ['parkerkrhoyt@gmail.com'],
      subject: '[Fasting Hours] Feedback',
      html: body.message
    } );

    return new Response( response.data.id );
  } catch ( error ) {
    return new Response( error.toString(), {
      status: 500
    } );
  }
};

export const config = {
  path: '/api/feedback'
};
