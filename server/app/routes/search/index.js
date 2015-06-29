'use strict';
var router = require('express').Router();
module.exports = router;
var request = require('request-promise');

router.get('/:query', function(req, res, next) {
    request({
        url: 'https://api.github.com/search/repositories?q=' + req.params.query + '&sort=stars&order=desc',
        headers: {
            'User-Agent': 'Pied Pipeline',
            'Authorization': 'token ' + req.user.github.token
        }
        // },
        // params: { 
        //     name: 'access_token',
        //     value: req.user.github.token
        // }
    })
    .then(function(response) {
        res.json(JSON.parse(response).items.slice(0, 20));
    })
    .catch(next)
})

router.get('/users/:user', function(req, res, next) {
    request({
        url: 'https://api.github.com/users/' + req.params.user + '/repos',
        headers: {
            'User-Agent': 'Pied Pipeline',
            'Authorization': 'token ' + req.user.github.token
        }
    })
    .then(function(response) {
        res.json(JSON.parse(response));
    })
    .catch(next)
})