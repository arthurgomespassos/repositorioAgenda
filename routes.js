const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const registerController = require('./src/controllers/registerController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

const { loginRequired } = require('./src/middlewares/middleware');

// Rotas da home
route.get('/', homeController.index);

// teste remover depois

// Rotas de resgister
route.get('/register/index', registerController.index);
route.post('/register/register', registerController.register);

// Rotas de login
route.get('/login/index', loginController.index);//poderia omitir a palavra index
route.post('/login/login', loginController.login);

// Rotas de logout
route.get('/login/logout', loginController.logout);

// Rotas de contato
route.get('/contato/index', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.register);
route.get('/contato/index/:id', loginRequired, contatoController.editIndex);
route.post('/contato/edit/:id', loginRequired, contatoController.edit);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);

module.exports = route;
