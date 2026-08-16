const router = require('express').Router();
const db = require('../db');

function ensureAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/auth/login');
  next();
}

router.get('/', ensureAuth, (req, res) => {
  res.render('cart', {
    title: 'Carrinho - Axé de Orum',
    user: req.session.user,
    cartItems: [],
    total: 0
  });
});

router.post('/adicionar', ensureAuth, (req, res) => {
  const { productId } = req.body;
  const userId = req.session.userId;

  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (!product) return res.status(404).send('Produto não encontrado');

    db.get(
      'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
      [userId, productId],
      (err, row) => {
        if (err) return res.status(500).send('Erro');

        if (row) {
          db.run(
            'UPDATE cart SET quantity = quantity + 1 WHERE id = ?',
            [row.id],
            (err2) => {
              if (err2) return res.status(500).send('Erro');
              res.redirect('/cart');
            }
          );
        } else {
          db.run(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)',
            [userId, productId],
            (err3) => {
              if (err3) return res.status(500).send('Erro');
              res.redirect('/cart');
            }
          );
        }
      }
    );
  });
});

router.post('/remover/:itemId', ensureAuth, (req, res) => {
  const { itemId } = req.params;
  db.run('DELETE FROM cart WHERE id = ?', [itemId], (err) => {
    if (err) return res.status(500).send('Erro');
    res.redirect('/cart');
  });
});

router.get '/checkout', ensureAuth, (req, res) => {
  db.all('SELECT * FROM cart WHERE user_id = ?', [req.session.userId], (err, items) => {
    if (err) return res.status(500).send('Erro');

    let total = 0;
    items.forEach(item => {
      db.get('SELECT price FROM products WHERE id = ?', [item.product_id], (err2, prod) => {
        if (prod) total += prod.price * item.quantity;
      });
    });

    res.render('checkout', {
      title: 'Checkout - Axé de Orum',
      user: req.session.user,
      items,
      total
    });
  });
});

module.exports = router;
