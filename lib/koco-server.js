var express = require('express');
var path = require('path');
var morgan = require('morgan');

function Server(options) {
    this.options = options || {};

    this.options.dir = this.options.dir || '.';

    this.expressApp = express();

    this.configureLogging();

    if (this.options.root) {
        this.configureRoot(options.root);
    }

    this.configureSpa();
    this.configureStaticFiles();




    // var router = express.Router();

    // router.route('/:page*')
    //     .all(function(req, res, next) {
    //         if (path.extname(req.path).length > 0) {
    //             // normal static file request
    //             next();
    //         } else {
    //             // should force return `index.html` for angular.js
    //             req.url = '/index.html';
    //             next();
    //         }
    //     });

    // this.expressApp.use('<%= baseUrl %>', router);

    // gutil.log('Serving files from ' + gutil.colors.green(this.configManager.get('serverPath')));
    // this.expressApp.use('<%= baseUrl %>', express.static(this.configManager.get('serverPath')));



}

Server.prototype.listen = function() {
    var self = this;

    self.server = self.expressApp.listen.apply(self.expressApp, arguments);
};

Server.prototype.getUrl = function() {
    var serverAddress = this.server.address();
    var serverHost = serverAddress.address === '0.0.0.0' || serverAddress.address === '::' ? 'localhost' : serverAddress.address;
    var url = 'http://' + serverHost + ':' + serverAddress.port + (this.options.root || '/');


    // var serverAddress = server.address();
    // var serverHost = serverAddress.address === '0.0.0.0' || serverAddress.address === '::' ? 'localhost' : serverAddress.address;
    // var url = 'http://' + serverHost + ':' + serverAddress.port + '<%= baseUrl %>';

    // gutil.log('Started ' + gutil.colors.green(global.buildEnv || process.env.NODE_ENV || 'dev') + ' server at ' + gutil.colors.cyan(url));

    // callback(null, url);


    return url;
};

Server.prototype.configureLogging = function() {
    //HTTP request logger middleware for node.js
    //https://www.npmjs.com/package/morgan
    this.expressApp.use(morgan('dev'));
};

Server.prototype.configureRoot = function(root) {
    this.expressApp.use(function(req, res, next) {
        var re = new RegExp("^\/" + root + "\/(.*)", "i");

        var result = req.path.match(re);

        if (result && result.length > 1) {
            req.url = '/' + result[1];
            next();
        } else {
            next();
        }
    });
};

Server.prototype.configureSpa = function() {
    this.expressApp.use(function(req, res, next) {
        if (path.extname(req.path).length > 0) {
            // normal static file request
            next();
        } else {
            // should force return `index.html` for pages
            req.url = '/index.html';
            next();
        }
    });
};

Server.prototype.configureStaticFiles = function() {
    //koco convention
    this.expressApp.use(express.static(this.options.dir));
};

exports.Server = Server;
