// Middleware de validação genérico usando Joi
exports.validate = (schema) => (req, res, next) => {
  // Valida o corpo da requisição (req.body) com o schema fornecido
  const { error } = schema.validate(req.body, {
    abortEarly: false,
  }); // Coleta todos os erros, não apenas o primeiro

  // Se houver erros de validação
  if (error) {
    return res.status(422).json({
      code: 'VALIDATION_ERROR',
      details: error.details.map((detail) => ({
        field: detail.path.join('.'), // Caminho do campo (ex: 'user.address.street')
        message: detail.message, // Mensagem de erro amigável
      })), // HTTP 422 - Unprocessable Entity
    });
  }

  // Se a validação for bem-sucedida, passa para o próximo middleware/controller
  next();
};
