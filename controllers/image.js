let imageController = {};
let aws = require("aws-sdk");
let sendError = require("../helpers/sendError");

var wasabiEndpoint = new aws.Endpoint("s3.wasabisys.com");
var s3 = new aws.S3({
  endpoint: wasabiEndpoint,
  accessKeyId: process.env.WASABI_ACCESS_KEY,
  secretAccessKey: process.env.WASABI_SECRET_KEY
});

imageController.UPLOAD_PROFILE_IMAGE = (req, res) => {
  let userId = req.params.userId;
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
      res.status(200).send({
        data,
        status: "Success"
      });
    } else {
      sendError("ImageUpload", err, req, "Image");
      res.status(401).send({
        error: "Error"
      });
    }
  });
};

imageController.GET_PROFILE_IMAGE = (req, res) => {
  let userId = req.params.userId;
  var params = {
    Bucket: "ooloo-profile-images",
    Key: userId
  };

  s3.getObject(params, function(error, data) {
    if (!err) {
      res.status(200).send({
        data
      });
    } else {
      sendError("GetProfileImage", err, req, "Image");
      res.status(400).send({
        error
      });
    }
  });
};

module.exports = imageController;
