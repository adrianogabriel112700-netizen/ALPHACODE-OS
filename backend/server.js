require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();

// Middlewares de Segurança
app.use(helmet());
app.use(cors());
app.use(express.json());

// Limite de Requisições para mitigar ataques de força bruta no login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: { message: 'Muitas tentativas. Tente novamente mais tarde.' }
});

app.use('/api/v1/auth/login', loginLimiter);

// Rotas de API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clients', clientRoutes);

// Tratamento de Rota Não Encontrada
app.use((req, res) => res.status(404).json({ message: 'Recurso não encontrado.' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[ALPHA CODE SYSTEM] Servidor rodando na porta ${PORT}`);
});


 const API_URL = 'https://alphacode-backend.onrender.com'; 