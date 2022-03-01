const Register = require('../models/RegisterModel');

exports.index = (req, res) => {
  res.render('register');
};

exports.register = async (req, res) => {
  try {
    const register = new Register(req.body);//chama a classe que faz a validação do dados de registro
    // res.send(register.body);
    await register.register();

    if (register.errors.length > 0) {
      req.flash('errors', register.errors);
      req.session.save(() => {
        return res.redirect('index');//register/index nesse caso
      });
      return;
    }

    req.flash('success', 'Seu usuário foi criado com sucesso!');
    req.session.save(() => {
      return res.redirect('index');//register/index nesse caso
    });
  } catch (err) {
    console.log(err);
    return res.render('404');
  }
};