exports.validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(422).json({
      code: 'VALIDATION_ERROR',
      details: error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      })),
    });
  }

  next();
};
