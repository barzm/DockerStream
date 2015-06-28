var request = require('request'); 
var fs = require('fs'); 
var uuid = require('node-uuid');
var tar = require('tar');
var Promise = require('bluebird'); 
Promise.promisifyAll(fs);

class Pipe {
	constructor(gitUrl,targetDirectory) {
		// this.order = order;
		this.targetDirectory = targetDirectory; 
		this.gitUrl = gitUrl;
		this.imgName = uuid.v1();
		this.username = this.gitUrl.split('/')[3];
		this.repo = this.gitUrl.split('/')[4];
	},
	runPipe() {
		console.log('downloading repository');
		console.log(`saving repository to: ${this.targetDirectory}/${username}-${repo}`);
		var file = fs.createWriteStream(`${this.targetDirectory}/${username}-${repo}`);
		var options = {
			url: `https://api.github.com/repos/${username}/${repo}/tarball`,
			headers: {
				'User-Agent': 'request'
			}
		}
		request.get(options,function (err, response, body){
			console.log("RESPONSE",response)
			//file.write(response.data)
		})
		.on('data',function (data){
			file.write(data)
		})
		.on('end',function (){
			file.end()
			buildAndRunDocker()
			return file
		})
	},
	buildAndRunDocker(){
		var tarOptions = {
			path: `${this.targetDirectory}/${username}-${repo}`,
			strip: 0
		};
		tar.extract(options)
		.on('error',function(err){
			console.log('error extracting ' + tarOptions.path)
		})
		.on('end',function(){
			var child = exec('cd ' + this.targetDirectory + '; docker build -t ' + this.imgName + ' .; docker run -v ' + this.targetDirectory + '/data ' + this.imgName,function(error,stdout,stderr){
				console.log("error : ", error);
				console.log("stdout : ", stdout);
				console.log("stderr : ", stderr);  
			});
		})

	}


	
}
module.exports = {
	Pipe:Pipe
}