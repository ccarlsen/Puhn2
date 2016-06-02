var config = {};

config.mongodb = {};
config.http = {};
config.crypto = {};

config.mongodb.host = 'localhost';
config.mongodb.port = '27017';
config.mongodb.collection = 'puhnchat';
config.mongodb.uri = 'mongodb://' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.collection;

config.http.port = '8082';
config.http.domain = 'https://puhn.co:' + config.http.port;
config.http.webmfolder = './public/webm/';
config.http.soundsfolder = './public/sounds/';
config.http.thumbfolder = './public/thumbnails/';

config.crypto.jwtSecret = '318f12ca6d1091de0eab95a3f93073fc';

module.exports = config;
