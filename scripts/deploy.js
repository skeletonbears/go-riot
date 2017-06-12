var AWS = require('aws-sdk');
var fs = require('fs');

var s3 = new AWS.S3({signatureVersion: 'v4'});

// Bucket names must be unique across all S3 users

var myBucket = 'kingsofleon';

var myKey = 'AKIAJ5EFGG6EZMIFDMNA';

function uploadFile(bucketName, file){
  var fs = require('fs');
  var mime = require('mime');

  var uploadParams = {Bucket: bucketName, Key: '', Body: '', ACL: 'public-read', ContentType: mime.lookup(file)};

  var fileStream = fs.createReadStream(file);
  fileStream.on('error', function(err) {
    console.log('File Error', err);
  });
  uploadParams.Body = fileStream;

  var path = require('path');
  file = file.replace("build/","")
  uploadParams.Key = file;

  // call S3 to retrieve upload file to specified bucket
  s3.upload (uploadParams, function (err, data) {
    if (err) {
      console.log("Error", err);
    } if (data) {
      console.log("Upload Success", data.Location);
    }
  });
}

function deploy(bucketName, rootFolder){
  fs.readdir(rootFolder, (err, dir) => {
    console.log("reading: " + dir);
    for(let filePath of dir){
      var path = rootFolder + "/" +filePath
      fs.stat(path, function(err, stats) {
        if (stats.isDirectory()) {
          console.log(path + " is a directory:")
          deploy(bucketName, path)
        }
        else{
          uploadFile(bucketName, rootFolder+"/"+filePath)
          //console.log(filePath)
        }
      });
    }
  });
}

deploy("kingsofleon","build")
