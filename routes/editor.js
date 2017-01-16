var router=require('express').Router();
var util=require('../app/util');

router.get('/edit', function(req, res) {
    res.render('editor', {title:'Editeur'});
});

router.get('/edit*',util.isLoggedIn, function(req, res, next) {
    res.locals.clientDatas = {
        socketUrl : req.protocol + '://' + req.get('host')
    };
    next();
});

router.get('/edit/:fileId',function(req, res) {
    res.locals.clientDatas = util.extend(res.locals.clientDatas, {
        file : {
            path: 'cloud/user_' + req.user.id + '/' + req.params.fileId,
            id: req.params.fileId
        }
    })
    res.render('editor', {title:'Editeur'});
});

module.exports=router;