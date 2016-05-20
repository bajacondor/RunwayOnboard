"use strict";
var express = require('express');
var router = express.Router();
var fs   = require('fs');
var check=false;

router.get('/urlSelect', function(req, res, next) {
    console.log(req.query);
    res.send("<option>one</option><option>two</option><option>three</option>");
});

router.get('/test', function(req, res, next) {
    res.send({action:'loading'});
    setTimeout(function(){
        check=true;
    },6000);
});
router.get('/test/check', function(req, res, next) {
    if (check){
        res.send({action:'done'});
        check=false;
    }
    else {
        res.send({action:'loading'});
    }
        
});


module.exports = router;

