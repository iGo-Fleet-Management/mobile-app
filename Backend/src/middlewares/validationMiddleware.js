// src/middlewares/validationMiddleware.js
exports.validate = (schemas) => (req, res, next) => {
  const validationErrors = [];

  if (schemas.query) {
    const { error, value } = schemas.query.validate(req.query, {
      abortEarly: false,
    });
    if (error) {
      validationErrors.push(...error.details);
    } else {
      req.query = value; // sobrescreve com valores validados
    }
  }

  if (schemas.body) {
    const { error, value } = schemas.body.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      validationErrors.push(...error.details);
    } else {
      req.body = value; // sobrescreve com valores validados
    }
  }

  if (validationErrors.length) {
    console.error('Validation Error:', validationErrors);
    return res.status(422).json({
      code: 'VALIDATION_ERROR',
      details: validationErrors.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      })),
    });
  }

  next();
};
