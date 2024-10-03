import nodemailer from 'nodemailer'


// Configurar el transporte
const transporter = nodemailer.createTransport({
    service: 'gmail', // También puedes usar otros servicios como Outlook, Yahoo, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
  });
  
  // Función para enviar correos
  const sendEmail = async (destinatario, asunto, mensaje) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER, // Correo del remitente
        to: destinatario, // Correo del destinatario
        subject: asunto, // Asunto del correo
        text: mensaje, // Mensaje en formato texto
      };
  
      // Enviar el correo
      const info = await transporter.sendMail(mailOptions);
      console.log('Correo enviado: ' + info.response);
    } catch (error) {
      console.error('Error al enviar el correo: ', error);
    }
  };
  
  export default {sendEmail }