exports.middlewareGlobal = (req, res, next) => {
  // res.locals.umaVariavelLocal = 'Este é o valor da variável local.';
  res.locals.errors = req.flash('errors');// captura a flash message de errors
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  next();
};

exports.outroMiddleware = (req, res, next) => {
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if (err/* && 'EBADCSRFTOKEN' === err.code*/) {
    return res.render('404');
  }
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash('errors', 'Você precisa fazer login.');
    req.session.save(() => res.redirect('/'));
  }

  next();
};