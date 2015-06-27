// this is where we instantiate containers and process user pipelines
var Docker = require('dockerode-promise');
var exec = require('exec'); 
var ghdownload = require('github-download');
var fs = require('fs'); //used to access dockerfile
var log = require("npmlog");
var axios = require('axios');
var request = require('request');
var Promise = require('bluebird');
var tartar = require('tar.gz');
var shell = require('shelljs'); 
var exec = require('child_process').exec;


Promise.promisifyAll(fs);

module.exports = {
	downloadRepo: downloadRepo
}

function downloadRepo() {
	console.log("executing run module")
	
	var file = fs.createWriteStream(__dirname + '/temp/repo.tar.gz')

	// var options = {
	// 	url: 'https://api.github.com/repos/mbarzizza/DockerTest/tarball',
	// 	headers: {
	// 		'User-Agent': 'request'
	// 	}
	// }
	// request.get(options,function (err, response, body){
	// 	console.log("RESPONSE",response)
	// 	//file.write(response.data)

	// })
	// .on('data',function (data){
	// 	console.log("writing chunk")
	// 	file.write(data)
	// })
	// .on('end',function (){
	// 	console.log("ending write file")
	// 	file.end()
	// 	buildDockerImage()
	// 	return file
	// })
	buildDockerImage()

}

function expandRepo(directory){


}


function buildDockerImage (tarPath){

	// var docker = new Docker({
	// 	socketPath: '/var/run/docker.sock',
	// 	host: '192.168.59.106',
	// 	port: process.env.DOCKER_PORT || 2376
	// }); 
	// console.log(docker);
	// docker.buildImage(__dirname + '/temp/test.tar',{t:'node'},function (err,response){
	// 	console.log('error ', err);
	// 	console.log('================');
	// 	console.log('response ',response);

	// })

	var child = exec('cd server/modules/temp/dockertest; docker build .');
}


// https://github.com/mbarzizza/DockerTest.git