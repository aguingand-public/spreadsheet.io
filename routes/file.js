var file=require('../models/file');
var router=require('express').Router();

router.post('/file', function(req,res) {
    var id=file.post({name:"Sheets sans nom", creator:req.user.username});
    
    res.redirect('edit/'+id);
});

module.exports = router;