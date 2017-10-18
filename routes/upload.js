var express = require('express');
var fs = require('fs');
var Jimp = require("jimp");
var router = express.Router();

// 프로필 이미지 업로드
router.post('/', function (req, res) {
  if (req.session.member_idx) {
    var filePath = 'uploads/' + req.session.member_idx;
    var ws = fs.createWriteStream(filePath + '.tmp');
    req.pipe(ws);
    ws.on('finish', function () {
      Jimp.read(filePath + '.tmp').then(function (image) {
        image.resize(300, 400).write(filePath + '.png', function () {
          fs.unlink(filePath + '.tmp', function (err) {
            if (!err) {
              res.json({'result': true});
            } else {
              res.json({'result': false, 'msg': 'upload_process_failed'});
            }
          });
        });
      }).catch(function (err) {
        fs.unlink(filePath + '.tmp', function (err) {
          res.json({'result': false, 'msg': 'upload_wrong_image'});
        });
      });
    });
    ws.on('error', function () {
      res.json({'result': false, 'msg': 'upload_failed'});
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

module.exports = router;
