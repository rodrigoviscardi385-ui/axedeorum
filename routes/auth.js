const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

router.get('/login', (req, res) => {
  res.render('auth/login', { title: 'Login - Axé de Orum', error: req.flash('error') });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).send('Erro interno');
    if (!user) {
      req.flash('error', 'E-mail ou senha inválidos');
      return res.redirect('/auth/login');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      req.flash('error', 'E-mail ou senha inválidos');
      return res.redirect('/auth/login');
    }
    req.session.userId = user.id;
    req.session.userRole = user.role;
    res.redirect('/builder');
  });
});

router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Registro - Axé de Orum', error: req.flash('error') });
});

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed], function(err) {
    if (err) {
      req.flash('error', 'E-mail já cadastrado ou erro ao registrar');
      return res.redirect('/auth/register');
    }
    req.session.userId = this.lastID;
    req.session.userRole = 'user';
    res.redirect('/builder');
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
