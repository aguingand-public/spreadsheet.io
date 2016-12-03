var file=require('../models/file');
var util = require('../app/util');
var router=require('express').Router();

router.get('/profile', util.isLoggedIn, function(req, res) {
    var f=file.getAll(req.user.username,function(files) {
        res.render('profile.ect', {title: "Page de profile", files:files});
    });
});

module.exports = router;

