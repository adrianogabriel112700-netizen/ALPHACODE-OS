const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@alphacode.com' && password === 'admin123') {
    const token = jwt.sign(
      { id: '123', role: 'admin' },
      process.env.JWT_SECRET || 'secret_key_alpha',
      { expiresIn: '8h' }
    );

    return res.json({
      token,
      user: { name: 'Diretoria Alpha', role: 'admin', email }
    });
  }

  return res.status(401).json({ message: 'Credenciais inválidas.' });
};