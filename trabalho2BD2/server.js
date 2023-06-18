const express = require('express');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/routes');
const Evento = require('./models/evento');
require('dotenv').config();


const app = express();

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost/eventosDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });

// Configurar o Express para receber dados do formulário
app.use(express.urlencoded({ extended: true }));

// Configurar template engine EJS
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

// Middleware para rotas relacionadas a eventos
app.use('/', eventRoutes);

// Iniciar o servidor
const port = 3033;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
