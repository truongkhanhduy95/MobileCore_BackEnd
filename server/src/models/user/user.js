'use strict';
let formidable = require('formidable');

module.exports = function (Myuser) {

  Myuser.edit = function (req, res, cb) {
    let hostUrl = req.protocol + '://' + req.get('host');
    let content = {};

    /*
    Setup form args
     */
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = './storage/avatar';
    form.keepExtensions = true;

    /*
    Manually parse data
     */
    form.parse(req, function (err, fields, files) {
      content = fields;
      if (files.image) {
        content.image = hostUrl + '/image/avatar/' + files.image.path.split('/').pop();
      }
    });

    /*
    send response here
     */
    form.on('end', function () {
      Myuser.findById(req.params.id, function (err, instance) {
        if (err) return cb(err);
        instance.updateAttributes(content, {validate: false}, function (err, userInstance) {
          if (err) return cb(err);
          console.log(userInstance);
          res.send(userInstance);
        });
      });
    });
  };

  Myuser.remoteMethod(
    'edit',
    {
      description: 'Replace exisiting user.',
      http: {path: '/:id', verb: 'put'},
      accepts: [
        {arg: 'req', type: 'object', 'http': {source: 'req'}},
        {arg: 'res', type: 'object', 'http': {source: 'res'}},
      ],
      returns: {type: Myuser, default: 'Myuser', root: true},
    }
  );

  Myuser.register = function (req, cb) {
    Myuser.create({
      email: req.email,
      password: req.password,
      firstName: req.firstName,
      lastName: req.lastName,
      image: req.image,
    }, function (err, userInstance) {
      console.log('create');
      if (err) {
        return cb(err);
      }
      else {
        Myuser.login({
          email: req.email,
          password: req.password
        }, 'user', function (err, token) {
          console.log('login');
          if (err) {
            /*
            response error
             */
            console.error(err);
            return cb(err);
          }
          const result = {
            'id': token.id,
            'userId': token.userId,
          };
          cb(null, result);
        });
      }
    });
  };

  Myuser.remoteMethod(
    'register',
    {
      description: 'Create a new user.',
      http: {path: '/', verb: 'post'},
      accepts: [
        {arg: 'data', type: 'object', http: {source: 'body'}},
      ],
      returns: {type: Myuser, default: 'Myuser', root: true},
    }
  );
};
