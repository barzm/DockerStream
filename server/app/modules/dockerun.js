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
    .then(function(pipeline) {
      return pipeline.runPipeline();
    })
    .then(function(path) {
      console.log("PATH in run module!!!!!!!! ", path);
      return path
    })
    .then(null, function(err) {
      console.log("Error in run: ", err.message, err.stack.split('\n'));
    })
}

function getRepository(gitUrl, pipelineId, githubToken) {
  console.log("IN get repo");
  var targetDirectory = './downloads/';
  var username = username = gitUrl.split('/')[3];
  var repo = gitUrl.split('/')[4];
  return new Promise(function(resolve, reject) {
    console.log('downloading repository');

    var fileStream = fs.createWriteStream(`${targetDirectory}/${username}-${repo}.tar.gz`);
    var options = {
      url: `https://api.github.com/repos/${username}/${repo}/tarball?access_token=${githubToken}`,
      headers: {
        'User-Agent': 'request'
      }
    };
    request.get(options).pipe(fileStream);
    fileStream.on('finish', function() {
      console.log("FILESTREAM write finished");
      // buildImage(targetDirectory, username, gitUrl).then(resolve);
      findDockerDir(username, repo, './downloads').then(function(dir) {
        resolve(dir);
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
      console.log('Error in makeContainerDir', err, err.stack.split('\n'));
    })

}

function deleteContainerDir(pipelineid) {
  return exec('rm -rf ./containers/' + pipelineId)
    .catch(function(err) {
      console.log("Error deleting container directory", err.message, err.stack.split('\n'));
    })
}

function buildImage(imgName, targetDirectory, gitUrl) {

  console.log("Building Docker Image");
  console.log("PASSED GITURL ", gitUrl);

  var username = gitUrl.split('/')[3];
  var repo = gitUrl.split('/')[4];
  var extractPromised = Promise.promisify(tar.extractTarball);
  console.log("BUILD IMAGE USERNAME ", username);
  console.log("BUILD IMAGE REPO ", repo);

  return extractPromised(`${targetDirectory}/${username}-${repo}.tar.gz`, targetDirectory)
    .then(function() {
      console.log('extraction hit');
      return findDockerDir(username, repo, targetDirectory);
    }).then(function(dir) {
      console.log("ABOUT TO BUILD IMAGE", 'cd ' + targetDirectory + '/' + dir + '; sudo docker build -t ' + imgName + ' .')
        // return exec(`cd ${targetDirectory}/${dir}; sudo docker build -t ${imgName} .; sudo docker run --name ${id} -v /vagrant ${volumeDir} /data:/data ${imgName}`);
      return exec('cd ' + targetDirectory + '/' + dir + '; sudo docker build -t ' + imgName + ' .')
        .then(function(result) {
          console.log('STDOUT', result.stdout);
          console.log('STDERR', result.stderr);
          if (!result.stderr) {
            return exec('rm -rf ' + targetDirectory + '/' + dir)
          }
          return
        })
        .fail(function(err) {
          console.log("ERR FAIL", err);
        })

    }).catch(function(err) {
      console.error(err.message, err.stack.split('\n'));
    });

}

function findDockerDir(username, repo, targetDirectory) {

  return fs.readdirAsync(targetDirectory)
    .then(function(files) {
      let test = new RegExp(username + '-' + repo + '-.');
      let matchedFile = files.filter(file => test.test(file))[0];
      return matchedFile;
    })

}
