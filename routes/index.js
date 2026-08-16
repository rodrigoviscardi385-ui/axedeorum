const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Axé de Orum - Guias Artesanais' });
});

router.get('/sobre', (req, res) => {
  res.render('sobre', { title: 'Sobre - Axé de Orum' });
});

router.get('/contato', (req, res) => {
  res.render('contato', { title: 'Contato - Axé de Orum' });
});

module.exports = router;
