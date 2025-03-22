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

exports.sendPasswordResetEmail = async (recipientEmail, resetLink) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: recipientEmail,
      subject: 'Recuperação de Senha',
      html: `
          <div>
            <h2>Recuperação de Senha</h2>
            <p>Você solicitou a recuperação de senha para sua conta.</p>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
              Redefinir Senha
            </a>
            <p>Este link é válido por 1 hora.</p>
            <p>Se você não solicitou esta recuperação, ignore este email.</p>
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
