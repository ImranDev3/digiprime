module.exports = {
  requireAdmin(req, res, next) {
    if (req.session && req.session.admin) {
      return next();
    }
    res.redirect('/admin/login');
  },

  redirectIfLoggedIn(req, res, next) {
    if (req.session && req.session.admin) {
      return res.redirect('/admin/dashboard');
    }
    next();
  }
};
