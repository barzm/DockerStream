// this is where we instantiate containers and process user pipelines
var Docker = require('dockerode-promise');
var ghdownload = require('github-download');
var fs = require('fs'); //used to access dockerfile
var request = require('request');
var Promise = require('bluebird');
var exec = require('child_process').exec;
var Pipe = require('../lib/Pipe').Pipe;
var Pipeline = require('../lib/Pipeline').Pipeline;


Promise.promisifyAll(fs);

module.exports = {
	run:run
}

function run(githubToken){
	// var pipeline = new Pipeline({gitUrl: 'https://github.com/mbarzizza/DockerTest',order:1},{gitUrl: 'https://github.com/mbarzizza/DockerTest2',order:2});
	console.log("running run")
	var pipeline = new Pipeline([{gitUrl: 'https://github.com/mbarzizza/DockerTest',order:1},{gitUrl: 'https://github.com/mbarzizza/DockerTest2',order:2}]);
	console.log("PIPELINE",pipeline)
	pipeline.buildPipeline()
	.then(function(){
		pipeline.runPipeline(githubToken);
	})
}

