var request = require('request');
var fs = require('fs');
var uuid = require('node-uuid');
var tar = require('tarball-extract');
var Promise = require('bluebird');
var exec = require('child-process-promise').exec;


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
		var self = this;

		return exec('sudo docker run --name ' + self.id + ' -v ' + this.targetDirectory + '/ahab:/ahab ' + self.imgName)
		.then(function(result){
			console.log("STDOUT ", result.stdout.split("\n"));
			console.log("STDERR ", result.stderr.split("\n"));
			return result;
		})
		.catch(function(err) {
			console.error("ERROR IN RUN EXEC",err.message, err.stack.split('\n'));
		});

	}
}
module.exports = {
	Pipe: Pipe
}
