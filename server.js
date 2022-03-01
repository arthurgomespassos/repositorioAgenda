require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.emit('pronto');//emite 'pronto' quando a base de dados estiver conectada
  })
  .catch(e => console.log(e));
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash'); // serve para fazer mensagens auto-destrutivas(flash-messages) que ao serem lidas, somem da sessão, bom para mandar feedbacks e mensagens de erro, essas mesagens precisam de express-session para funcionar
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet'); // desative no localchost se tiver erros no bootstrap por não estar usando ssl o https
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet()); // desative no calchost se tiver erros no bootstrap

app.use(express.urlencoded({ extended: true }));//trata as requisições do body pra que elas não sejam sempre undefined, permitindo postar formularios para dentro da aplicação
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

const MILISSECONDS_IN_WEEK = 604800000;
const sessionOptions = session({
  secret: 'akasdfj0út23453456+54qt23qv  qwf qwer qwer qewr asdasdasda a6()',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: MILISSECONDS_IN_WEEK,
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());
// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);

// em qual porta o servidor vai correr porta 3000
// se o sinal 'pronto' for emitido ele ira executar e começará a executar
app.on('pronto', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
  });
});
