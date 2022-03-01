const Register = require('../models/RegisterModel');

exports.index = (req, res) => {
  if (req.session.user) return res.render('login-logado');
  res.render('login');
};

exports.login = async (req, res) => {
  try {
    const register = new Register(req.body);//chama a classe que faz a validação do dados de registro
    await register.login();

    if (register.errors.length > 0) {
      req.flash('errors', register.errors);
      req.session.save(() => {
        return res.redirect('index');//login/index nesse caso
      });
      return;
    }

    req.flash('success', 'Você entrou no sistema!');
    req.session.user = register.user;
    req.session.save(() => {
      return res.redirect('index');//login/index nesse caso
    });
  } catch (err) {
    console.log(err);
    return res.render('404');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};