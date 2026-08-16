const router = require('express').Router();
const db = require('../db');

function ensureAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/auth/login');
  next();
}

function ensureAdmin(req, res, next) {
  if (!req.session.userRole || req.session.userRole !== 'admin') return res.status(403).send('Acesso restrito');
  next();
}

// Listar produtos
router.get('/', ensureAuth, ensureAdmin, (req, res) => {
  const category = req.query.category || '';
  let query = 'SELECT * FROM products';
  let params = [];

  if (category) {
    query += ' WHERE category = ?';
    params.push(category);
  }

  db.all(query, params, (err, products) => {
    if (err) return res.status(500).send('Erro');
    res.render('admin/products', {
      title: 'Produtos - Painel Admin',
      user: req.session.user,
      products,
      category
    });
  });
});

// Novo produto
router.get('/novo', ensureAuth, ensureAdmin, (req, res) => {
  res.render('admin/product-form', {
    title: 'Novo Produto - Painel Admin',
    user: req.session.user,
    product: null,
    action: '/admin/products',
    method: 'POST'
  });
});

router.post('/novo', ensureAuth, ensureAdmin, (req, res) => {
  const { name, description, price, category } = req.body;
  db.run(
    'INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)',
    [name, description, price, category],
    (err) => {
      if (err) return res.status(500).send('Erro ao criar produto');
      res.redirect('/admin/products');
    }
  );
});

// Editar produto
router.get('/editar/:id', ensureAuth, ensureAdmin, (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, product) => {
    if (!product) return res.status(404).send('Produto não encontrado');
    res.render('admin/product-form', {
      title: 'Editar Produto - Painel Admin',
      user: req.session.user,
      product,
      action: `/admin/products/editar/${product.id}`,
      method: 'PUT'
    });
  });
});

router.put('/editar/:id', ensureAuth, ensureAdmin, (req, res) => {
  const { name, description, price, category } = req.body;
  db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, category = ? WHERE id = ?',
    [name, description, price, category, req.params.id],
    (err) => {
      if (err) return res.status(500).send('Erro ao atualizar produto');
      res.redirect('/admin/products');
    }
  );
});

// Excluir produto
router.delete('/excluir/:id', ensureAuth, ensureAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send('Erro');
    res.json({ success: true });
  });
});

module.exports = router;
