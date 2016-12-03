var router=require('express').Router();

router.get('*', function(req,res,next) {
    // Données de base injecté

    res.locals.user = req.user || {};
    res.locals.user.isAuthenticated=req.isAuthenticated();

    //console.log(req.user);
    //console.log(baseData.user)

    res.locals.navUrl = req.path!='/'?'//'+req.get('host'):'';
    
    //console.log(req.path);
    next();
});

module.exports = router;