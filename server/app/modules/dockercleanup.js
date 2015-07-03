var Docker = require('dockerode-promise');
var Promise = require('bluebird');
var exec = require('child-process-promise').exec;
var Pipeline = require('../lib/Pipeline').Pipeline;
var mongoose = require('mongoose');
var PipelineModel = mongoose.model('Pipeline');

module.exports = {
  deleteImage: deleteImage
}

function deleteImage(pipelineId){
  var promises = [];
  console.log("ABOUT TO DELETE IMAGES",pipelineId);
  return PipelineModel.findById(pipelineId)
  .exec()
  .then(function(pipeline){
    console.log("PIPELINE",pipeline.pipeline);
    pipeline.pipeline.forEach(function(pipe){
      console.log("about to delete image:",pipe.imageId);
      promises.push(exec('sudo docker rmi -f ' + pipe.imageId));
    })
    console.log("about to return all promises");
    return Promise.all(promises);
  })
  .then(null,function(err){
    console.log("ERROR deleting images",err.message,err.stack.split('\n'));
  })
}
