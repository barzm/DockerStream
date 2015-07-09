var request = require('request');
var fs = require('fs');
var uuid = require('node-uuid');
var tar = require('tarball-extract');
var Promise = require('bluebird');
var exec = require('child-process-promise').exec;
var chalk = require('chalk');


fs = Promise.promisifyAll(fs);
class Pipe {
	constructor(imgName, targetDirectory) {
		this.next;
		this.prev;
		this.id = uuid.v4();
		this.imgName = imgName;
		this.targetDirectory = targetDirectory;
	}

	runPipe() {
		console.log("BUILD AND RUN DOCKER", this.targetDirectory);
		console.log("DIRNAME",__dirname)
		console.log("THIS IS THE ID FOR THE PIPE :", this.id);
		var self = this;

		return exec('sudo docker run --name ' + self.id + ' -v ' + this.targetDirectory + '/ahab:/ahab ' + self.imgName)
		.progress(function(cp){
			console.log(`${self.id} container running: `);
			cp.stdout.on('data',function(data){
				console.log('RUN PIPE STDOUT ', data.toString());
			})
			cp.stderr.on('data',function(data){
				console.log(chalk.red('RUN PIPE ERR ',data.toString()));
			})

		})
		.then(function(result){
			console.log("STDOUT ", result.stdout.split("\n"));
			console.log("STDERR ", result.stderr.split("\n"));
			return result;
		})
		.catch(function(err) {
			console.error("ERROR IN RUN EXEC",err.message, err.stack.split('\n'));
			console.error(err.message, err.stack.split('\n'));
		});

	}
}
module.exports = {
	Pipe: Pipe
}
