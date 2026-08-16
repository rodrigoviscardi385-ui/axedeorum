const Database = require('sqlite3').Database;

const db = new Database('./db/axedeorum.db', (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
    process.exit(1);
  }
  console.log('Banco de dados Axé de Orum conectado.');
});

module.exports = db;