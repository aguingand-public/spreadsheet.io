var file=require('../models/file');
var router=require('express').Router();

var cloud=require('../app/cloud');

router.post('/file', function(req,res) {
    file.post({name:"Sheets sans nom", creator:req.user.username}, function(id) {
        cloud.createFile(id,req.user.username);
        res.redirect('edit/'+id);
    });
});

module.exports = router;