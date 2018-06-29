'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  
  var path = require('path');
  router.get('/image/avatar/:name',
    function (req, res, next) {
      // do something with req.user
      res.sendFile(path.resolve('./storage/avatar/'+req.params.name), function(err){
        if(err)
          res.status(404).send('File not found');
      });
    }
  );

  router.get('/image/news/:name',
    function (req, res, next) {
      // do something with req.user
      res.sendFile(path.resolve('./storage/news/'+req.params.name), function(err){
        if(err)
          res.status(404).send('File not found');
      });
    }
  );

  server.use(router);
};
