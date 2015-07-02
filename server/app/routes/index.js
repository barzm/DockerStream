'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/tutorial', require('./tutorial'));
router.use('/members', require('./members'));
router.use('/run',require('./run'));
router.use('/search', require('./search'));
router.use('/user', require('./user'));
router.use('/pipelines', require('./pipelines'));

router.use(function (req, res) {
    res.status(404).end();
});
