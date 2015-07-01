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
		var self = this;

		return exec('sudo docker run --name ' + self.id + ' -v ' + '/vagrant'+this.targetDirectory + '/data:/data ' + self.imgName)
		.catch(function(err) {
			console.error(err.message, err.stack.split('\n'));
		});

	}
}
module.exports = {
	Pipe: Pipe
}
