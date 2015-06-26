// this is where we instantiate containers and process user pipelines
var Docker = require('dockerode-promise');
var exec = require('exec'); 
var ghdownload = require('github-download');
var fs = require('fs'); //used to access dockerfile
var log = require("npmlog");
var axios = require('axios');
var Promise = require('bluebird');
var tartar = require('tar.gz');

Promise.promisifyAll(fs);

module.exports = function() {
	axios.get('https://api.github.com/repos/mbarzizza/DockerTest/tarball')
	.then(function(response){
		console.log('response',response)
		return response
	})
	.catch(function(err){
		if(err.status===302){
			return axios.get(err.headers.location)
		}
	})
	.then(function (response){
		var file = fs.createWriteStream(__dirname + '/temp/repo.tar.gz')
		console.log('response',response)
		file.write(response.data)
		// response.on('data',function(chunk){
		// 	console.log("stream")
		// 	file.write(chunk)
		// })
		// .on('end',function(){
		// 	file.end()
		// 	return file

		// })
		// return tarRepo(response.data)
	})
	// .then(function (file){
	// 	console.log("FILE",file)
	// })
	.catch(function(err){
		console.log("2nd err",err)
	})
}


function tarRepo(buffer){
	// console.log("BUFFER",buffer)
	var file = fs.createWriteStream(__dirname + '/temp/repo.tar.gz')
	return file.write(buffer)

}

// https://github.com/mbarzizza/DockerTest.git