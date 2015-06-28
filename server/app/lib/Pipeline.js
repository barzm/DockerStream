var uuid = require('node-uuid'); 
var exec = require('child_process').exec;
var Promise = require('bluebird');

class Pipeline {
	constructor(pipeArray) {
		this.pipes = [];
		this.mongoId;
		this.uuid=generateId();
		this.targetDir;
		buildPipeline(pipeArray);
	},
	addPipe(gitUrl) { //add to mongo pipeline

	},
	getPipeline() {
		return this.pipes;
	},
	generateId() {
		this.uuid = uuid.v1();
		this.targetDir = __dirname + '/containers/' + this.uuid;
		exec('mkdir ' + this.targetDir);
		exec('mkdir ' + this.targetDir + '/data')
	},
	buildPipeline(){
		var pipe;
		var pipeline = pipeArray.sort(function(a,b){
			if(a.order > b.order) return 1
			if(a.order < b.order) return -1
			return 0
		})
		var l = pipeline.length
		for(var i=0; i<l; i++){
			this.pipes.push(new Pipe(pipeline[i].gitUrl,this.targetDir)) 
		}
	},
	runPipeline(){
		var l = this.pipes.length;
		for(var i=0;i<l;i++){
			this.pipes[i].runPipe();
		}
	}
}
module.exports={
	Pipeline:Pipeline
}