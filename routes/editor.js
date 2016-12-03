var router=require('express').Router();
var util=require('../app/util');

router.get('/edit*',util.isLoggedIn, function(req, res, next) {
    res.locals.socketUrl = req.get('host');
    next();
});

router.get('/edit/:fileId',function(req, res) {
    res.locals.file = {
        path: 'cloud/user_' + req.user.id + '/' + req.params.fileId
    };
    res.render('editor', {title:'Editeur'});
});

module.exports=router;