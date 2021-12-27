const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
sendMail = async function (options) {
  const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '39bc375184f050',
      pass: '11360dc851dd90',
    },
  });
  const mailOptions = {
    from: 'wojtekdab15@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transport.sendMail(mailOptions);
};

console.error();
module.exports = sendMail;
