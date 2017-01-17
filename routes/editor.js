var router=require('express').Router();
var util=require('../app/util');
var cloud=require('../app/cloud');
var file=require('../models/file');

router.get('/edit', function(req, res) {
    res.render('editor', {title:'Editeur'});
});

router.get('/edit*',util.isLoggedIn, function(req, res, next) {
    res.locals.clientDatas = {
        socketUrl : req.protocol + '://' + req.get('host')
    };
    next();
});

router.get('/edit/:fileId', function(req, res) {
    file.getOne(req.params.fileId, function(file) {
        res.locals.clientDatas = util.extend(res.locals.clientDatas, {
            file : {
                path: cloud.getPathWeb(req.params.fileId),
                id: req.params.fileId,
                name: file.name
            }
        })
        res.render('editor', {title:'Editeur'});
    }); 
});

module.exports=router;