const userService = require('../services/userService');

exports.completeRegistration = async (req, res) => {
  try {
    const { user_id } = req.user;
    const { cpf, birthdate, phone, address } = req.body;

    const result = await userService.completeProfile(
      user_id,
      { cpf, birthdate, phone },
      address
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      code: error.code || 'SERVER_ERROR',
      message: error.message,
    });
  }
};
