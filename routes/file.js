var file=require('../models/file');
var router=require('express').Router();

var cloud=require('../app/cloud');

router.post('/file', function(req,res) {
    file.create({name:"Sheet sans nom", creator:req.user.username}, function(id) {
        cloud.createFile(id,req.user.username);
        res.redirect('edit/'+id);
    });
});

router.post('/file/:fileId/rename', function(req,res) {
    console.log('renaming file');
    file.rename(req.params.fileId, req.body.filename, function(rows) {
        res.status(200).end();
    });
});

module.exports = router;
