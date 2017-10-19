var express = require('express');
var fs = require('fs');
var Jimp = require('jimp');
var md5File = require('md5-file');
var path = require('path');
var member = require('../db/member');
var router = express.Router();

// 프로필 이미지 업로드
router.post('/', function (req, res) {
  if (req.session.member_idx) {
    member.read_idx(req.session.member_idx, function (result, data) {
      if (result) {
        if (data[0]['profile_img'] === null) {
          var filePath = path.join(__dirname, '../uploads', req.session.member_idx.toString());
          var ws = fs.createWriteStream(filePath + '.tmp');
          req.pipe(ws);
          ws.on('finish', function () {
            upload_img_process(res, req.session.member_idx, filePath);
          });
          ws.on('error', function () {
            res.json({'result': false, 'msg': 'upload_failed'});
          });
        } else {
          res.json({'result': false, 'msg': 'upload_img_exists'});
        }
      } else {
        res.json({'result': false, 'msg': 'upload_server_error'});
      }
    });
  } else {
    res.json({'result': false, 'msg': 'authentication_required'});
  }
});

// 프로필 이미지 다운로드
router.get('/:profile_img', function (req, res) {
  member.read_profile_img(req.params.profile_img, function (result, data) {
    if (result) {
      res.setHeader('Content-Type', 'image/png');
      res.sendFile(path.join(__dirname, '../uploads', data[0]['idx'] + '.png'), function (err) {
        if (err) {
          res.sendFile(path.join(__dirname, '../uploads', 'profile.png'));
        }
      });
    } else {
      res.setHeader('Content-Type', 'image/png');
      res.sendFile(path.join(__dirname, '../uploads', 'profile.png'));
    }
  });
});

// # 이미지 처리
var upload_img_process = function (res, member_idx, filePath) {
  Jimp.read(filePath + '.tmp').then(function (image) {
    image.resize(300, 400).write(filePath + '.png', function () {
      upload_tmp_delete(res, member_idx, filePath, true);
    });
  }).catch(function (err) {
    upload_tmp_delete(res, member_idx, filePath, false);
  });
};

// # 임시 파일 삭제
var upload_tmp_delete = function (res, member_idx, filePath, is_ok) {
  fs.unlink(filePath + '.tmp', function (err) {
    if (is_ok && !err) {
      upload_file_md5(res, member_idx, filePath);
    } else if (!is_ok) {
      res.json({'result': false, 'msg': 'upload_wrong_image'});
    } else  {
      res.json({'result': false, 'msg': 'upload_process_failed'});
    }
  });
};

// # 프로필 해시 계산
var upload_file_md5 = function (res, member_idx, filePath) {
  md5File(filePath + '.png', function (err, hash) {
    if (!err) {
      upload_set_profile(res, member_idx, hash);
    } else {
      res.json({'result': false, 'msg': 'upload_process_failed'});
    }
  });
};

// # DB에 프로필 등록
var upload_set_profile = function (res, member_idx, hash) {
  member.update(member_idx, {'profile_img': hash}, function (m_result) {
    if (m_result) {
      res.json({'result': true});
    } else {
      res.json({'result': false, 'msg': 'upload_process_failed'});
    }
  });
};

module.exports = router;
