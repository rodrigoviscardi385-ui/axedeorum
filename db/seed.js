const db = require('../db');

// Inserir produtos iniciais
const insertProducts = `
INSERT OR IGNORE INTO products (name, description, price, image, category) VALUES
('Pingente Oxum', 'Pingente banhado a ouro com conchas e contas de Oxum', 89.90, '', 'pendente'),
('Pingente Iemanjá', 'Pingente em prata com ondas e conchas de Iemanjá', 79.90, '', 'pendente'),
('Pingente Oshun', 'Pingente banhado a ouro com características de Oshun', 85.90, '', 'pendente'),
('Pingente Shango', 'Pingente em ferro com o machado de Shango', 95.90, '', 'pendente'),
('Pingente Exu', 'Pingente pequeno em metal com símbolo de Exu', 69.90, '', 'pendente'),
('Firma Oxum', 'Firma murano para Oxum - cores douradas e amarelas', 45.00, '', 'firma'),
('Firma Iemanjá', 'Firma murano para Iemanjá - cores brancas e azuis', 45.00, '', 'firma'),
('Firma Oshun', 'Firma murano para Oshun - cores amarelas e brancas', 45.00, '', 'firma'),
('Firma Shango', 'Firma murano para Shango - cores vermelhas e brancas', 45.00, '', 'firma'),
('Firma Exu', 'Firma murano para Exu - cores pretas e vermelhas', 45.00, '', 'firma');
`;

db.exec(insertProducts, (err) => {
  if (err) console.error('Erro ao inserir produtos:', err);
  console.log('Produtos iniciais inseridos.');
});