var uuid = require('node-uuid');

var Promise = require('bluebird');
var Pipe = require('./Pipe').Pipe;
var exec = require('child-process-promise').exec;

class Pipeline {
    constructor(pipeArray) {
        // this.pipes = [];
        this.mongoId;
        this.uuid;
        this.targetDir;
        this.pipeArray = pipeArray;
        this.head;
        this.tail;
        // this.buildPipeline(pipeArray);
    }

    makeContainerDir() {
        var self = this;
        console.log("\n=========MAKING FOLDER=========\n");
        console.log("TARGET", this.targetDir)
        return exec('mkdir ../../..' + self.targetDir)
            .then(function () {
                console.log("MAKING data folder",self.targetDir)
                return exec('mkdir ../../..' + self.targetDir + '/test')
            })
            .catch(function (err) {
                console.log("ERROR IN make container", err.stack)
            })

    }

    buildPipeline() {
      console.log("\n=========BUILDING PIPELINE=========\n");
        var self = this;

                // console.log("PIPELINE IN BUILD",self.pipeArray)
                return this.makeContainerDir()
                .then(function(){
                  var pipeline = self.pipeArray.sort(function (a, b) {
                      if (a.order > b.order) return 1
                      if (a.order < b.order) return -1
                      return 0
                  });
                  var l = pipeline.length
                  for (var i = 0; i < l; i++) {
                      var newPipe = new Pipe(pipeline[i].imageId, self.targetDir);
                      if (typeof self.head === 'undefined') {
                          self.head = newPipe;
                          self.tail = self.head;
                      } else {
                          self.tail.next = newPipe;
                          newPipe.prev = self.tail;
                          self.tail = newPipe;
                      }
                  }
                  var cur = self.head;
                  return self
                })

    }

    runPipeline() {
      console.log("\n=========RUNNNING PIPELINE========\n")
        var self = this;
        function executePipe(pipe) {
            return pipe.runPipe().then(function () {
                if (pipe.next){
                	console.log('\nEXECUTING PIPE>NEXT\n');
                    return executePipe(pipe.next);
                }
                else {
                    console.log('end of pipeline');
                    console.log('\nTHIS PATH SHOULD BE RETURNED TO THE ROUTE',self.targetDir+'/data/output.json\n')
                    return self.targetDir + '/data/output.json';
                }
            }).catch(function (err) {
                console.log("Error in pipeline: ", err);
            })
        }
        return executePipe(this.head);
    }
}

module.exports = {
    Pipeline: Pipeline
}
