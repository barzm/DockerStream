var request = require('request');
var fs = require('fs');
var uuid = require('node-uuid');
var tar = require('tarball-extract');
var Promise = require('bluebird');
var exec = require('child-process-promise').exec;


fs = Promise.promisifyAll(fs);
class Pipe {
	constructor(gitUrl, targetDirectory) {
		// this.order = order;
		this.targetDirectory = targetDirectory;
		this.gitUrl = gitUrl;
		this.imgName = uuid.v4();
		this.username = this.gitUrl.split('/')[3];
		this.repo = this.gitUrl.split('/')[4];
		this.next;
		this.prev;
		this.id = uuid.v4();
	}
	runPipe(githubToken) {
		//test
		var self = this; 
		return new Promise(function(resolve, reject) {
			githubToken = 'b961650ae655eb63c1ac1741228b71dbb1b178e6';
			console.log('downloading repository');
			console.log(`saving repository to: ${self.targetDirectory}/${self.username}-${self.repo}`);
			var file = fs.createWriteStream(`${self.targetDirectory}/${self.username}-${self.repo}.tar.gz`);
			var options = {
				url: `https://api.github.com/repos/${self.username}/${self.repo}/tarball?access_token=${githubToken}`,
				headers: {
					'User-Agent': 'request'
				}
			}
			return request.get(options, function(err, response, body) {

				})
				.on('data', function(data) {
					console.log("writing data");
					file.write(data);
				})
				.on('end', function() {
					file.end();
					self.buildAndRunDocker(function(err,result){
						if(!err){
							resolve(); 
						}
						else{
							reject(err);
						}
					});
				})
		})
	}

	buildAndRunDocker(done) {
		var self = this;
		console.log("ABOUT TO EXTRACT")
		return tar.extractTarball(`${this.targetDirectory}/${this.username}-${this.repo}.tar.gz`, self.targetDirectory, function(err, result) {
			if (err) console.log("EXTRACT ERROR", err)
			else {
				return self.findDockerDir(self.username, self.repo)
					.then(function(dir) {
						console.log('DIR', dir)
						var volumeDir = self.targetDirectory.slice(1);

							console.log("NO PREVIOUS")                                                                                                                                  // Refactor this 
							console.log('cd ' + self.targetDirectory + '/' + dir + '; sudo docker build -t ' + self.imgName + ' .; sudo docker run --name ' + self.id + ' -v ' +'/vagrant'+ volumeDir + '/data:/data ' + self.imgName)
							return exec('cd ' + self.targetDirectory + '/' + dir + '; sudo docker build -t ' + self.imgName + ' .; sudo docker run --name ' + self.id + ' -v ' + '/vagrant'+volumeDir + '/data:/data ' + self.imgName)
					})
					.then(function(result) {
						console.log("DOCKER RESULTS");
						console.log("stdout : ", result.stdout);
						console.log("stderr : ", result.stderr);
						done(null,true);
					})
					.catch(function(err) {
						console.log("ERR", err)
						done(err); 
					})
			}

		})
	}

	findDockerDir(username, repo) {
		return fs.readdirAsync(this.targetDirectory)
			.then(function(files) {
				var test = RegExp(username + '-' + repo + '-.');
				var dir;
				var l = files.length;
				for (var i = 0; i < l; i++) {
					if (test.test(files[i])) {
						return files[i];
					}
				}
				return
			})

	}
}
module.exports = {
	Pipe: Pipe
}