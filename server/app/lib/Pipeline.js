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

    addPipe(gitUrl) { //add to mongo pipeline

    }

    getPipeline() {
        return this.pipes;
    }

    // generateId() {
    //     var self = this;
    //     this.uuid = uuid.v4();
    //     this.targetDir = './containers/' + this.uuid;
    //     console.log("TARGET", this.targetDir)
    //     return exec('mkdir ' + self.targetDir)
    //         .then(function () {
    //             console.log("MAKING data folder")
    //             return exec('mkdir ' + self.targetDir + '/data')
    //         })
    //         .catch(function (err) {
    //             console.log("ERROR IN generateId", err.stack)
    //         })

    // }

    buildPipeline() {
        var self = this;

        return self.generateId()
            .then(function () {
                // console.log("PIPELINE IN BUILD",self.pipeArray)
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
                while (cur) {
                    console.log(cur.repo, "--->");
                    cur = cur.next;
                }
                return self
            });
    }

    runPipeline() {
        var self = this;

        function executePipe(pipe) {
            pipe.runPipe().then(function () {
                console.log("about to exeecute pipe");
                console.log('NEXT PIPE', pipe.next);
                if (pipe.next){
                	console.log('EXECUTING PIPE>NEXT');
                    executePipe(pipe.next);
                }
                else {
                    console.log('end of pipeline');
                    console.log('END TARGET DIR ', self.targetDir);
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