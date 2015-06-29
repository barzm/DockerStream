var uuid = require('node-uuid'); 

var Promise = require('bluebird');
var Pipe = require('./Pipe').Pipe;
var exec = require('child-process-promise').exec;

class Pipeline {
	constructor(pipeArray,githubToken) {
		// this.pipes = [];
		this.mongoId;
		this.uuid;
		this.targetDir;
		this.pipeArray = pipeArray;
		this.head;
		this.tail;
		// this.buildPipeline(pipeArray);
	}
	addPipe(gitUrl) { //add to mongo pipeline

	}
	getPipeline() {
		return this.pipes;
	}
	generateId() {
		var self = this;
		this.uuid = uuid.v1();
		this.targetDir = './containers/' + this.uuid;
		console.log("TARGET",this.targetDir)
		return exec('mkdir ' + self.targetDir)
		.then(function(){
			console.log("MAKING data folder")
			return exec('mkdir ' + self.targetDir + '/data')
		})
		.catch(function(err){
			console.log("ERROR IN generateId",err.stack)
		})
		
	}

	buildPipeline(){
		var pipe;
		var self = this;
		return new Promise(function(resolve,reject){
			self.generateId()
			.then(function(){
				// console.log("PIPELINE IN BUILD",self.pipeArray)
				var pipeline = self.pipeArray.sort(function(a,b){
					if(a.order > b.order) return 1
					if(a.order < b.order) return -1
					return 0
				})
				var l = pipeline.length
				
				for(var i=0; i<l; i++){
					var newPipe = new Pipe(pipeline[i].gitUrl,self.targetDir);
					// console.log("NEW PIPE HERE ", newPipe);
					// console.log("HEAD HERE " , self.head);
					if(typeof self.head === 'undefined'){
						// console.log("NO HEAD EXISTS- EMPTY LIST")
						self.head = newPipe;
						self.tail = self.head; 
					}else{
						self.tail.next = newPipe;
						self.tail = newPipe; 
					}
				}
				var cur = self.head; 
				while(cur){
					console.log(cur.repo,"--->");
					cur = cur.next; 
				}
				resolve()
			})
		})
	}

	runPipeline(githubToken){
		console.log("ABOUT TO RUN PIPELINE")
		// var l = this.pipearr.length;
		function executePipe(pipe){
			pipe.runPipe().then(function(){
				console.log("about to execute pipe");
				if(pipe.next)executePipe(pipe.next);
				else{
					console.log('end of pipeline');
					//handle data output
				}
			}).catch(function(err){
				console.log("Error in pipeline: ",err); 
			})
		}
		executePipe(this.head); 
	}
}

module.exports={
	Pipeline:Pipeline
}