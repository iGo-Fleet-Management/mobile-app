const nodemailer = require('nodemailer');

// Cria o transporter do Nodemailer com as configurações de email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendPasswordResetEmail = async (recipientEmail, resetCode) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: recipientEmail,
      subject: 'Recuperação de Senha',
      html: `
          <div>
            <h2>Recuperação de Senha</h2>
            <p>Seu código de verificação é: <strong>${resetCode}</strong></p>
            <p>Código válido por 10 minutos.</p>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email de recuperação de senha');
  }
};
