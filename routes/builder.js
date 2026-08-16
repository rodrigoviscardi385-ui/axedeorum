const router = require('express').Router();
const db = require('../db');

// Helper: verificar se usuário logado
function ensureAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/auth/login');
  next();
}

// Lista de Orixás para o builder
const orixas = [
  { id: 1, nome: 'Oxum', cor: 'amarelo/laranja', elemento: 'água doce' },
  { id: 2, nome: 'Iemanjá', cor: 'branco/azul', elemento: 'mar' },
  { id: 3, nome: 'Oshun', cor: 'amarelo/branco', elemento: 'água doce' },
  { id: 4, nome: 'Shango', cor: 'vermelho/branco', elemento: 'fogo' },
  { id: 5, nome: 'Oxossi', cor: 'verde/branco', elemento: 'mato' },
  { id: 6, nome: 'Oxalá', cor: 'branco/cinza', elemento: 'ar' },
  { id: 7, nome: 'Iansã', cor: 'vinho/branco', elemento: 'vento' },
  { id: 8, nome: 'Ogum', cor: 'preto/verde', elemento: 'ferro' }
];

router.get('/criar', ensureAuth, (req, res) => {
  res.render('builder', {
    title: 'Criar Guia - Axé de Orum',
    user: req.session.user,
    orixas,
    session: req.session
  });
});

router.post('/guia/salvar', ensureAuth, (req, res) => {
  const {
    orixa, colors, size, firmes, pendantId,
    extras, price
  } = req.body;

  const userId = req.session.userId;
  const colorsJson = JSON.stringify(colors || []);
  const firmesJson = JSON.stringify(firmes || []);

  db.run(
    `INSERT INTO guides (user_id, orixa, colors, size, firmes, pendant_id, extras, price, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'rascunho')`,
    [userId, orixa, colorsJson, size, firmesJson, pendantId, extras, price],
    function(err) {
      if (err) return res.status(500).send('Erro ao salvar guia');
      res.redirect(`/builder/minhas-guidas`);
    }
  );
});

router.get('/minhas-guidas', ensureAuth, (req, res) => {
  db.all(`SELECT * FROM guides WHERE user_id = ? ORDER BY created_at DESC`, [req.session.userId], (err, guides) => {
    if (err) return res.status(500).send('Erro ao carregar guias');
    res.render('minhas-guidas', {
      title: 'Minhas Guias - Axé de Orum',
      user: req.session.user,
      guides
    });
  });
});

router.get('/guia/:id', ensureAuth, (req, res) => {
  db.get(`SELECT * FROM guides WHERE id = ? AND user_id = ?`, [req.params.id, req.session.userId], (err, guide) => {
    if (err) return res.status(500).send('Erro');
    if (!guide) return res.status(404).send('Guia não encontrada');
    res.render('guia-detalhe', {
      title: 'Minhas Guia - Axé de Orum',
      user: req.session.user,
      guide
    });
  });
});

module.exports = router;
