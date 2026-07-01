export async function sendMailjetEmail({
  toEmail,
  toName,
  subject,
  text,
  html,
  fromEmail = process.env.SENDER_EMAIL!,
  fromName = "Aurex Capital"
}: {
  toEmail: string;
  toName: string;
  subject: string;
  text: string;
  html: string;
  fromEmail?: string;
  fromName?: string;
}) {
  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${process.env.MAILJET_API_KEY}:${process.env.MAILJET_API_SECRET}`).toString('base64'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Messages: [
        {
          From: { Email: fromEmail, Name: fromName },
          To: [{ Email: toEmail, Name: toName }],
          Subject: subject,
          TextPart: text,
          HTMLPart: html,
        }
      ]
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.Messages?.[0]?.Errors?.[0]?.ErrorMessage || 'Mailjet send error');
  }
  return data;
}