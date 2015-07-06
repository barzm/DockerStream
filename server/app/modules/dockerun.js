// this is where we instantiate containers and process user pipelines
var Docker = require('dockerode-promise');
var ghdownload = require('github-download');
var fs = require('fs'); //used to access dockerfile
var request = require('request');
var Promise = require('bluebird');
var exec = require('child-process-promise').exec;
var tar = require('tarball-extract');
var Pipe = require('../lib/Pipe').Pipe;
var Pipeline = require('../lib/Pipeline').Pipeline;
var mongoose = require('mongoose');
var PipelineModel = mongoose.model('Pipeline');
var env = require('../../env/development');



Promise.promisifyAll(fs);

module.exports = {
  run: run,
  getRepository: getRepository,
  buildImage: buildImage,
  makeContainerDir: makeContainerDir
}

function run(pipelineId, cb, githubToken) {
  return PipelineModel.findById(pipelineId)
    // console.log("FOUND PIPELINE ", p);
    // var pipeline = new Pipeline(p.pipeline);
    // pipeline.targetDir = '/containers/' + p._id;
    // return pipeline;
    .exec().then(function(p) {
      var pipeline = new Pipeline(p.pipeline);
      pipeline.mongoId = p._id;
      pipeline.targetDir = '/containers/' + p._id;
      return pipeline;
    })
    .then(function(pipeline) {
      return pipeline.buildPipeline();
    })
    .then(null,function(err){
      err.message = "There was a problem building the pipeline";
      return err;
    })
    .then(function(pipeline) {
      return pipeline.runPipeline();
    })
    .then(null, function(err){
      err.message = "There was a problem running the pipeline";
      return err;
    })
    .then(function(path) {
      console.log("PATH in run module!!!!!!!! ", path);
      return path
    })
    .then(null, function(err) {
      err.message = "There was a problem in dockerun run";
      err.status = 911;
      return err;
    })
}

function getRepository(gitUrl, pipelineId, githubToken) {
  var targetDirectory = './downloads/';
  var username = username = gitUrl.split('/')[3];
  var repo = gitUrl.split('/')[4];
  console.log("getRepository: ", username, repo); 
  return new Promise(function(resolve, reject) {
    var fileStream = fs.createWriteStream(`${targetDirectory}/${username}-${repo}.tar.gz`);
    var options = {
      url: `https://api.github.com/repos/${username}/${repo}/tarball?access_token=${githubToken}`,
      headers: {
        'User-Agent': 'request'
      }
    };
    request.get(options).pipe(fileStream);
    fileStream.on('finish', function() {
      findDockerDir(username, repo, './downloads').then(function(dir) {
        return resolve(dir);
      });
    });
    fileStream.on('error', reject);
  });

}

function makeContainerDir(pipelineId) {
  console.log("IN makeContainerDir");
  var targetDirectory = './containers/' + pipelineId;
  return exec('mkdir ' + targetDirectory)
    .catch(function(err) {
      err.message = "There was a problem making the container directory";
      err.status = 911;
      return err;
    })
}

function deleteContainerDir(pipelineid) {
  return exec('rm -rf ./containers/' + pipelineId)
    .catch(function(err) {
      err.message = "There was a problem deleting the container directory";
      err.status = 911;
      return err;
    })
}

function buildImage(imgName, targetDirectory, gitUrl) {

  var username = gitUrl.split('/')[3];
  var repo = gitUrl.split('/')[4];
  var extractPromised = Promise.promisify(tar.extractTarball);

  return extractPromised(`${targetDirectory}/${username}-${repo}.tar.gz`, targetDirectory)
    .then(function() {
      return findDockerDir(username, repo, targetDirectory);
    }).then(function(dir) {
      return exec('cd ' + targetDirectory + '/' + dir + '; sudo docker build  --no-cache -t ' + imgName + ' .')
        .then(function(result) {
          console.log('STDOUT', result.stdout);
          console.log('STDERR', result.stderr);
          if (!result.stderr) {
            return exec('rm -rf ' + targetDirectory + '/' + dir)
          }
          return
        })
        .fail(function(err) {
          err.message = "There was a problem building the image";
          console.log("ERR FAIL", err);
          return err
        })

    }).catch(function(err) {
      err.message = "There was a problem extracting the tarball";
      return err;
    });
}

function findDockerDir(username, repo, targetDirectory) {
  return fs.readdirAsync(targetDirectory)
    .then(function(files) {
      let test = new RegExp(username + '-' + repo + '-.');
      let matchedFile = files.filter(file => test.test(file))[0];
      return matchedFile;
    })
    .catch(function(err){
      err.message = "There was a problem reading the directory contents";
      return err;
    })
}
