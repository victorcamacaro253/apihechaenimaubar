
// emailService.js
import nodemailer from 'nodemailer';

// Configuración del transportador
const transporter = nodemailer.createTransport({
   service:'gmail',
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER, // Tu dirección de correo
      pass: process.env.EMAIL_PASS, // Tu contraseña de correo
    },
  });

// Función para enviar correos electrónicos
 const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // El remitente
    to:to, // El destinatario
    subject: subject, // El asunto
    text: text, // El cuerpo del correo
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: %s', info.messageId);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw new Error('Error al enviar correo electrónico');
  }
};

export default sendEmail