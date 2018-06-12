let interestController = {};
const path = require("path");
const fs = require("fs");
const aws = require("aws-sdk");

var wasabiEndpoint = new aws.Endpoint("s3.wasabisys.com");
var s3 = new aws.S3({
  endpoint: wasabiEndpoint,
  accessKeyId: process.env.WASABI_ACCESS_KEY,
  secretAccessKey: process.env.WASABI_SECRET_KEY
});

interestController.UPLOAD_PROFILE_IMAGE = (req, res) => {
  let userId = req.params.userId;
  let filePath = req.files.imageFiles.name;
  var params = {
    Bucket: "ooloo-profile-images",
    Key: userId,
    Body: req.files.imageFiles.data
  };

  var options = {
    partSize: 10 * 1024 * 1024, // 10 MB
    queueSize: 10
  };

  s3.upload(params, options, function(err, data) {
    if (!err) {
      console.log("data", data);
      res.status(200).send({
        data,
        status: "Success"
      });
    } else {
      console.log(err); // an error occurred
      res.status(401).send({
        error: "Error"
      });
    }
  });
};

interestController.GET_PROFILE_IMAGE = (req, res) => {
  let userId = req.params.userId;
  var params = {
    Bucket: "ooloo-profile-images",
    Key: userId
  };

  s3.getObject(params, function(error, data) {
    if (!err) {
      console.log(data); // successful response
      res.status(200).send({
        data
      });
      /*
        data = {
         AcceptRanges: "bytes", 
         ContentLength: 3191, 
         ContentType: "image/jpeg", 
         ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"", 
         LastModified: <Date Representation>, 
         Metadata: {
         }, 
         TagCount: 2, 
         VersionId: "null"
        }
        */
    } else {
      console.log(err); // an error occurred
      res.status(400).send({
        error
      });
    }
  });
};

module.exports = interestController;
