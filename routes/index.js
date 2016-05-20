"use strict";
var express = require('express');
var router = express.Router();
var _ = require('lodash');
var yaml = require("js-yaml");
var fs   = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
    var arr = fs.readdirSync('Configs');
    var ret = _.map(arr,function(filename){
       return filename.slice(0,-4);
    });
    console.log(JSON.stringify(ret));
    res.render('index', {files: ret});
});

router.get('/show/:job', function(req, res, next){
    var configYaml = yaml.safeLoad(fs.readFileSync('ROConfig.yml', 'utf8'));
    var yml = fs.readFileSync('Configs/' + req.params.job + '.yml', 'utf8');
    var config = yaml.safeLoad(yml);
    var ret = {};
    _.forEach(configYaml.configs, function(value, key){
        ret[key]={label:value.label, value: config.configs[key]};
        if (value.type==='job')
            ret[key]['jobAction'] = value.jobAction;
    });
    delete ret.createJira;
    res.render('show', {job: ret, jobTitle: req.params.job});
});

router.get('/new', nocache, function(req, res, next){
   var configYaml = yaml.safeLoad(fs.readFileSync('ROConfig.yml', 'utf8'));
   var ret={};
   _.forEach(configYaml.configs, function(value, key){
       if (value.priority===0)
           ret[key]=value;
   });
   console.log('new');
   console.log(ret);
   res.render('new', {config: ret});
});

router.post('/new', nocache, function(req, res, next){
    console.log(JSON.stringify(req.body));
    //var ret={configs: _.pick(req.body, ['serviceName', 'serviceDescription, IAMRole, teamName'])};
    var ret={configs: req.body};
    //CREATE JIRA ISSUES
    if (ret.configs.createJira==='on'){
        
    }
    delete ret.configs.createJira;
    console.log('HELLO');
    console.log(ret);
    var job = req.body.teamName + '-' + req.body.serviceName;
    fs.writeFileSync('Configs/' + job + '.yml', yaml.safeDump(ret), 'utf8');
    res.redirect('/edit/' + job);
});

router.get('/edit/:job', nocache, function(req, res, next){
    var yml = fs.readFileSync('Configs/' + req.params.job + '.yml', 'utf8');
    var config = yaml.safeLoad(yml);
    var configYaml = yaml.safeLoad(fs.readFileSync('ROConfig.yml', 'utf8'));
    delete configYaml.configs.createJira;
    _.forEach(configYaml.configs, function(value, key){
        if(config.configs.hasOwnProperty(key)){
           configYaml.configs[key]['value'] = config.configs[key];
        }
        if(value.hasOwnProperty('subConfigs')){
            _.forEach(configYaml.configs[key].subConfigs, function(subValue, subKey){
                if(config.configs.hasOwnProperty(subKey)){
                    configYaml.configs[key].subConfigs[subKey]['value'] = config.configs[subKey];
                }
            });
        }
    });
    res.render('edit', {config: configYaml.configs, jobTitle: req.params.job});
});

router.post('/edit/:job', nocache, function(req, res, next){
    console.log(JSON.stringify(req.body));
    var ret={configs: req.body};
    console.log('hi');
    console.log(ret);
    var job = req.body.teamName + '-' + req.body.serviceName;
    fs.writeFileSync('Configs/' + job + '.yml', yaml.safeDump(ret), 'utf8');
    res.redirect('/show/' + job);
});

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
};

module.exports = router;
