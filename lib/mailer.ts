import nodemailer from 'nodemailer';

const mailHost = (process.env.MAIL_HOST || 'smtp.gmail.com').replace(/^"|"$/g, '');
const mailUser = (process.env.MAIL_USER || 'martins.paraclet@gmail.com').replace(/^"|"$/g, '');
const mailPass = (process.env.MAIL_PASS || 'lgju akuy vzke tzbb').replace(/^"|"$/g, '');
const mailPort = Number((process.env.MAIL_PORT || '465').toString().replace(/^"|"$/g, ''));

const transporter = nodemailer.createTransport({
  host: mailHost,
  port: mailPort, 
  secure: true, 
  auth: {
    user: mailUser,
    pass: mailPass,
  },
});

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const senderEmail = (process.env.SENDER_EMAIL || mailUser).replace(/^"|"$/g, '');
  const mailOptions = {
    from: senderEmail,
    to,
    subject,
    html,
  };
  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Nodemailer sendMail error:', {
      error,
      mailOptions,
    });
    throw error;
  }
}

