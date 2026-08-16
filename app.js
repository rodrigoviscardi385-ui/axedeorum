const express = require('express');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');
const MethodOverride = require('method-override');
const SQLiteStore = require('connect-sqlite3')(session);
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(MethodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session setup
app.use(session({
  name: 'axedeorum_sid',
  secret: process.env.SESSION_SECRET || 'axedeorum-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
  },
  store: new SQLiteStore({ db: './database/sessions.db', table: 'sessions' })
}));

app.use(flash());

// Global locals
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.isLoggedIn = req.isAuthenticated() || !!req.session.userId;
  res.locals.flash = req.flash();
  next();
});

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const builderRouter = require('./routes/builder');
const cartRouter = require('./routes/cart');
const adminRouter = require('./routes/admin');
const whatsappRouter = require('./routes/whatsapp');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/builder', builderRouter);
app.use('/cart', cartRouter);
app.use('/admin', adminRouter);
app.use('/whatsapp', whatsappRouter);

// 404
app.use((req, res) => {
  res.status(404).render('404.ejs', { title: 'Página não encontrada' });
});

// Start
app.listen(PORT, () => {
  console.log(`🌐 Axé de Orum rodando em http://localhost:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
