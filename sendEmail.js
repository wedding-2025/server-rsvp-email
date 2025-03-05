import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const authUser = process.env.BREVO_AUTH_USER;
const authPass = process.env.BREVO_AUTH_PASS;

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: { 
    user: authUser,
    pass: authPass,
  },
});

/**
 * Send an email with the given data
 * @param {Object} data
 */
  export const sendEmail = async ({ email, cantMakeIt, guestNames, wellWishingMessage }) => {
  // Checking for cantMakeIt condition
  const isCantMakeIt = typeof cantMakeIt === 'boolean' ? cantMakeIt : cantMakeIt === 'true';

  // Get the first Name of the guest
  const firstName = guestNames[0]?.firstName || 'Guest';
  const lastName = guestNames[0]?.lastName || '';

  // For Google calender reminder
  const eventDate = '20250104T090000Z'; // Use UTC format: YYYYMMDDTHHmmssZ
  const eventEndDate = '20250104T150000Z'; // End time in UTC format
  const eventTitle = 'M & C 2025 Wedding';
  const eventLocation = 'Holy Name Parish, Umuchu';
  const eventDescription = 'Join us for the wedding celebration of M & C!';

  const googleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventDate}/${eventEndDate}&details=${encodeURIComponent(eventDescription)}&location=${encodeURIComponent(eventLocation)}`;

  // Create the email body based on CantMakeIt condition
  const emailBody = `
    <body>
      <div style='font-size:18px; color:#fff;'>
        <p>Dear ${firstName},</p>
        ${isCantMakeIt ?
          `
            <p>Thank you for letting us know. We're sorry to hear that you can't make it to our wedding.</p>
            <p>If anything changes, please feel free to update your RSVP.</p>
            <p> <a href='http://mandc2025.org/rsvp/rsvp-form'>Resend RSVP?</a> </p>
          `
          :
          `
            <p>Thank you for confirming your attendance at our wedding. We're excited to welcome you on the event day!</p>
            <p style='margin-top=5px; margin-bottom=3px'>Here are the details:</p>
            <ul style='color:#d3d3d3;'>
              <li><strong>Date:</strong> Jan 4th 2025</li>
              <li><strong>Wedding Location:</strong> <a href='https://maps.app.goo.gl/PQrqnmtmYnceX5hs7' target='_blank'>Holy Name Parish, Umuchu</a></li>
              <li><strong>Traditional Marriage Location:</strong> <a href='https://maps.app.goo.gl/vCcLLUoLynrBaVbc7'>Umuojogwo, Umuchu</a></li>
              <li><strong>Guests: </strong>${guestNames.map(guest => `${guest.firstName} ${guest.lastName}`).join(', ')}</li>
              <li>Guest Count: ${guestNames.length}</li>

              <span style='margin-top=6px;'><i>Event Timeline (WAT)</i>:</span>
              <li>Church Wedding - <strong>10:00 AM</strong></li>
              <li style='margin-bottom=3px'>Traditional Marriage - <strong>02:00 PM</strong></li>
            </ul>
            <div style='margin-top:3px; margin-bottom:3px'>
              <p>You can <a href="${googleCalendarLink}" target="_blank">add this event to your Google Calendar</a> to set a reminder!</p>
              <p>if you have any question, feel free to reach out.</p>
            </div>
            <p> <a href='http://mandc2025.org/rsvp/rsvp-form'>Resend RSVP?</a> </p>
          `
          }
          <p>Best regards,</p>
          <p>The Event Team</p>
      </div>
    </body>
  ` ;

  // Sending the email
  await transporter.sendMail({
    from: '"M & C 2025" <rsvp@mandc2025.org>',
    to: email,
    subject: 'Welcome to our wedding!',
    text: `Thank you for your RSVP`,
    html: emailBody,
    replyTo: 'mj.charles2025@gmail.com',
  });



  // Organizer email body
  const organizerEmailBody = ` 
    <body>
      <div style='font-size:18px; color:#fff;>
        <p>Hello Event Organizer,</p>
        <p style='margin-bottom=5px'>A new RSVP has been received:</p>
        <ul style='margin-bottom=5px'>
          <li><strong>Guest Name:</strong> ${firstName} ${lastName}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
        ${cantMakeIt ?
          `<p><strong>Status:</strong> The guest has indicated they <strong>Cannot Attend</strong>.</p>`
          :
          `<p><strong>Status:</strong> The guest has confirmed they <strong>will be attending</strong>.</p>
          <ul>
            <li><strong>Guests: </strong>${guestNames.map(guest => `${guest.firstName} ${guest.lastName}`).join(', ')}</li>
            <li>Guest Count: ${guestNames.length}</li>
          </ul>
          `
        }
        ${wellWishingMessage ?
          `<p><strong>Well-Wishing Message:</strong></p>
          <p>${wellWishingMessage}</p>`
          :
          `<p><strong>Well-Wishing Message:</strong> No message provided.</p>`
        }
        <p>Best regards,</p>
        <p>RSVP System</p>
      </div>
    </body>
  `;

  // Sending the email to the organizer
  await transporter.sendMail({
    from: '"M & C 2025" <mj.charles2025@gmail.com>',
    to: 'mj.charles2025@gmail.com', // Organizer's email address
    subject: 'New RSVP Response',
    text: `A new RSVP from ${firstName} has been received`,
    html: organizerEmailBody,
    replyTo: 'mj.charles2025@gmail.com',
  });
};
