const authService = require('../services/authService');

exports.register = async (req, res) => {
  try {
    const { user_type, name, last_name, email, password } = req.body;
    const user = await authService.register(
      user_type,
      name,
      last_name,
      email,
      password
    );
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await authService.login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
