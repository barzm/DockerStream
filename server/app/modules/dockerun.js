// this is where we instantiate containers and process user pipelines
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
var path = require('path');
var chalk =require('chalk');


Promise.promisifyAll(fs);

module.exports = {
  run: run,
  getRepository: getRepository,
  buildImage: buildImage,
  makeContainerDir: makeContainerDir
}

function run(pipelineId, cb, githubToken) {
  return PipelineModel.findById(pipelineId)
    .exec().then(function(p) {
      console.log("P",p);
      var pipeline = new Pipeline(p.pipeline);
      pipeline.mongoId = p._id;
      //Dev: Building to /vagrant/containers
      pipeline.targetDir = path.join(__dirname,'../../../containers/'+p._id);
      console.log("NEW PIPELINE",pipeline);
      return pipeline;
    })
    .then(function(pipeline) {
      console.log("ABOUT TO BUILD PIPELINE",pipeline);
      return pipeline.buildPipeline();
    })
    .then(null,function(err){
      err.customMessage = "There was a problem building the pipeline";
      return err;
    })
    .then(function(pipeline) {
      console.log("ABOUT TO RUN PIPELINE!!!!",pipeline);
      return pipeline.runPipeline();
    })
    .then(null, function(err){
      err.customMessage = "There was a problem running the pipeline";
      return err;
    })
    .then(function(path) {
      console.log("PATH in run module!!!!!!!! ", path);
      return path
    })
    .then(null, function(err) {
      err.customMessage = "There was a problem in dockerun run";
      err.status = 911;
      return err;
    })
}

function getRepository(gitUrl, pipelineId, githubToken) {
  // Dev: targetDirectory: /vagrant/downloads/
  var targetDirectory = path.join(__dirname,'../../../downloads');
  var username = username = gitUrl.split('/')[3];
  var repo = gitUrl.split('/')[4];
  // console.log("getRepository: ", username, repo);
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
        resolve();
    });
    fileStream.on('error', reject);
  });

}

function makeContainerDir(pipelineId) {
  var targetDirectory= path.join(__dirname,'../../../containers/'+pipelineId);
  // console.log(chalk.cyan("makeContainerDir targetDirectory: ", targetDirectory));
  // var targetDirectory = './containers/' + pipelineId;
  return exec('mkdir ' + targetDirectory)
    .catch(function(err) {
      err.customMessage = "There was a problem making the container directory";
      err.status = 911;
      return err;
    })
}

function deleteContainerDir(pipelineid) {
  console.log("DELETE CONTAINERS RUNNING");
  return exec('rm -rf '+path.join(__dirname,'.../../../containers/') + pipelineId)
    .catch(function(err) {
      err.customMessage = "There was a problem deleting the container directory";
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
      console.log('build imminent.',`targetDirectory ${targetDirectory} and `);
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
          err.customMessage = "There was a problem building the image";
          return err
        })

    }).catch(function(err) {
      err.customMessage = "There was a problem extracting the tarball";
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
      err.customMessage = "There was a problem reading the directory contents";
      return err;
    })
}
