const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres', // Especifica o protocolo (opcional, mas recomendado para Neon)
  dialectOptions: {
    ssl: {
      require: true, // Exige SSL
      rejectUnauthorized: false, // Ignora a validação do certificado (necessário para Neon)
    },
  },
  logging: false, // Desativa logs de queries no console
  pool: {
    max: 5, // Número máximo de conexões no pool
    min: 1, // Número mínimo de conexões no pool
    acquire: 15000, // Tempo máximo (em ms) para tentar obter uma conexão antes de lançar um erro
    idle: 5000, // Tempo máximo (em ms) que uma conexão pode ficar ociosa antes de ser liberada
  },
});

module.exports = sequelize;
