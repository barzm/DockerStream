'use strict';
var router = require('express').Router();
module.exports = router;
var request = require('request-promise');

router.get('/:query', function(req, res, next) {
    request({
            url: 'https://api.github.com/search/repositories?q=' + req.params.query + '&sort=stars&order=desc',
            headers: {
                'User-Agent': 'Pied Pipeline'
            }
        })
        .then(function(response) {
            res.json(JSON.parse(response).items.slice(0, 20));
        })
        .catch(next)
})