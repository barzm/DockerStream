var request = require('request'); 
var fs = require('fs'); 
var uuid = require('node-uuid');
var tar = require('tarball-extract');
var Promise = require('bluebird'); 
var exec = require('child-process-promise').exec;
Promise.promisifyAll(fs);
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
		githubToken = '3afda4593b90cc736160fc475fcfebad0e7d1934'
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
				console.log("TARBALL EXTRACTED")
				var child = exec('cd ' + self.targetDirectory + '; docker build -t ' + self.imgName + ' .; docker run -v ' + self.targetDirectory + '/data ' + self.imgName,function(error,stdout,stderr){
					console.log("error : ", error);
					console.log("stdout : ", stdout);
					console.log("stderr : ", stderr);  
				});
			}
		})
	}	
}
module.exports = {
	Pipe:Pipe
}