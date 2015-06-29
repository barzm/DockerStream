var request = require('request'); 
var fs = require('fs'); 
var uuid = require('node-uuid');
var tar = require('tarball-extract');
var Promise = require('bluebird'); 
var exec = require('child-process-promise').exec;
fs = Promise.promisifyAll(fs);
class Pipe {
	constructor(gitUrl,targetDirectory) {
		// this.order = order;
		this.targetDirectory = targetDirectory; 
		this.gitUrl = gitUrl;
		this.imgName = uuid.v1();
		this.username = this.gitUrl.split('/')[3];
		this.repo = this.gitUrl.split('/')[4];
	}
	runPipe(githubToken) {
		//test
		githubToken = 'ec443496349e4446c31dfb303f6da63dcb63b2aa'
		console.log('downloading repository');
		console.log(`saving repository to: ${this.targetDirectory}/${this.username}-${this.repo}`);
		var self = this;
		var file = fs.createWriteStream(`${this.targetDirectory}/${this.username}-${this.repo}.tar.gz`);
		var options = {
			url: `https://api.github.com/repos/${this.username}/${this.repo}/tarball?access_token=${githubToken}`,
			headers: {
				'User-Agent': 'request'
			}
		}
		request.get(options,function (err, response, body){
			
		})
		.on('data',function (data){
			console.log("writing data" )
			file.write(data)
		})
		.on('end',function (){
			file.end()
			self.buildAndRunDocker()
			return file
		})
	}
	buildAndRunDocker(){
		var self = this;
		console.log("ABOUT TO EXTRACT")
		tar.extractTarball(`${this.targetDirectory}/${this.username}-${this.repo}.tar.gz`,self.targetDirectory,function(err,result){
			if(err) console.log("EXTRACT ERROR",err)
			else{
				self.findDockerDir(self.username,self.repo)
				.then(function(dir){
					console.log('DIR',dir)
					var volumeDir = self.targetDirectory.slice(1);
					var child = exec('cd ' + self.targetDirectory + '/' + dir + '; sudo docker build -t ' + self.imgName + ' .; sudo docker run -v ' + __dirname + '/' + volumeDir  + '/data ' + self.imgName)
					.then(function(result){
						console.log("DOCKER RESULTS");
						console.log("stdout : ", result.stdout);
						console.log("stderr : ", result.stderr);  
					})
					.fail(function(err){
						console.log("ERR",err)
					})
				})

			}
		})
	}

	findDockerDir(username,repo){
		return fs.readdirAsync(this.targetDirectory)
		.then(function(files){
			var test = RegExp(username+'-'+repo+'-.');
			var dir;
			var l = files.length;
			for(var i=0; i<l; i++){
				if(test.test(files[i])){
					return files[i];
				} 		
			}
			return 
		})

	}	
}
module.exports = {
	Pipe:Pipe
}
