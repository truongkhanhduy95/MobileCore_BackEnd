'use strict';
let formidable = require('formidable');

module.exports = function (News) {

    News.edit = function (req, res, cb) {
        console.log('edit news')
        let hostUrl = req.protocol + '://' + req.get('host');
        let content = {};
        let category = News.app.models.category;
        /*
        Setup form args
         */
        let form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = './storage/news';
        form.keepExtensions = true;

        /*
        Manually parse data
         */
        form.parse(req, function (err, fields, files) {
            content = fields;
            if (files.image) {
                content.image = hostUrl + '/image/news/' + files.image.path.split('/').pop();
            }
        });

        /*
        send response here
         */
        form.on('end', function () {
            console.log(content)
            News.findById(req.params.id).then(function (news) {
                if(content.categoryId) {
                    category.findById(content.categoryId,{include:'news'})
                        .then(category => {
                            if(!category)
                            {
                                res.send("This category is not exist")
                            }
                        })
                        .catch(err => cb(err))
                }
                news.updateAttributes(content, { validate: false }, function (err, newsInstance) {
                    if (err) return cb(err);
                    console.log(newsInstance);
                    res.send(newsInstance);
                });
            }).catch(err => cb(err)) 
        });
    };

    News.remoteMethod(
        'edit',
        {
            description: 'Edit news',
            http: { path: '/:id', verb: 'put' },
            accepts: [
                { arg: 'req', type: 'object', 'http': { source: 'req' } },
                { arg: 'res', type: 'object', 'http': { source: 'res' } }
            ],
            returns: { type: News, default: 'News', root: true },
        }
    );

    News.createNews = function (req, res, cb) {
        console.log('create news')
        let hostUrl = req.protocol + '://' + req.get('host');
        let content = {};

        /*
        Setup form args
         */
        let form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.uploadDir = './storage/news';
        form.keepExtensions = true;

        /*
        Manually parse data
         */
        form.parse(req, function (err, fields, files) {
            content = fields;
            if (files.image) {
                content.image = hostUrl + '/image/news/' + files.image.path.split('/').pop();
            }
        });

        /*
        send response here
         */
        form.on('end', function () {
            console.log(content)
            News.create(content, function (err, newsInstance) {
                if (err) {
                    return cb(err);
                }
                res.send(newsInstance);
            });
        });

    };

    News.remoteMethod(
        'createNews',
        {
            description: 'Create news',
            http: { path: '/', verb: 'post' },
            accepts: [
                { arg: 'req', type: 'object', 'http': { source: 'req' } },
                { arg: 'res', type: 'object', 'http': { source: 'res' } }
            ],
            returns: { type: News, default: 'News', root: true },
        }
    );
};
