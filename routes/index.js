module.exports = function(app, passport) {

    // IMPORTANT : en premier
    app.use(require('./datas'));


    app.use(require('./auth')(passport));
    app.use(require('./file'));
    app.use(require('./editor'));
    app.use(require('./user'));

    /// Routes des pages HOME
    app.get('/', function(req, res) {
        res.render('index',{title:'home'});
    });

    app.get('/login', function(req, res) {
        res.render('login',{title:'Se connecter', message:req.flash('loginMessage')});
    });

    app.get('/register', function(req, res) {
        res.render('register',{title:"S'inscrire", message: req.flash('signupMessage')});
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};