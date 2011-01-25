/*
 * download.js: Downloads IRC logs from the specified location(s) 
 *
 * (C) 2010 Marak Squires and Charlie Robbins
 * MIT LICENSE
 *
 */

var path = require('path'),
    eyes = require('eyes'),
    request = require('request'),
    winston = require('winston'),
    pool = require('pool'),
    url = require('url'),
    fs = require('fs');

var manager = pool.createPoolManager(), logPool;

manager.setMinClients(0);
manager.setMaxClients(500);

var options = exports.options = {
  "logSource" : "http://nodejs.debuggable.com/",
  "startTime" : new Date('11/23/2009').getTime(),
  "endTime"   : new Date().getTime(),
  "logPath"   : path.join(__dirname, '..', '..', 'data', 'irc-logs', 'raw')
};

function getPool () {
  if (!logPool) {
    eyes.inspect('getPool');
    logPool = manager.getPool(80, url.parse(options.logSource).host);
  } 
  
  return logPool;
}

//
// function downloadAll (callback)
//   Downloads the IRC logs from the specified source
//
var downloadAll = exports.downloadAll = function (callback) {  
  fs.stat(options.logPath, function (err, stats) {
    if (err) return callback(err);
    
    var hasErr = false, times = [], files = [];
    
    for (var downloadTime = options.startTime; downloadTime < options.endTime; downloadTime += 86400000) {
      times.push(downloadTime);
    }
    
    var length = times.length, downloaded = 0;
    
    times.forEach(function (time) { 
      downloadFile(time, function (err, data, filename) {
        downloaded++;
        
        if (err || hasErr) {
          hasErr = true;
          return
        }

        files.push(filename);
        if (downloaded === length) {
          callback(null, files);
        }
      });
    });
  });
};

var downloadFile = exports.downloadFile = function (time, callback) {
  var date     = new Date(time),
      year     = date.getFullYear(),
      month    = (date.getMonth() + 1).toString(),
      day      = (date.getDate()).toString(),
      logPool  = getPool();
  
  if (month.length === 1) month = '0' + month;
  if (day.length === 1) day = '0' + day;
  
  var filename = [year, month, day].join('-') + '.txt',
      uri = options.logSource + filename;
  
  logPool.getClient(function (client) {
    var fileOptions = {
      method: 'GET',
      client: client,
      uri: uri
    };

    winston.silly('Attempting to download file: ' + uri);
    request(fileOptions, function (err, response, body) {
      if (err) return callback(err);

      var saveTo = path.join(options.logPath, filename);
      fs.writeFile(saveTo, body, function (err) {
        if (err) return callback(err);

        winston.silly('Successfully downloaded file: ' + uri);
        callback(null, body, saveTo);
      });
    });
  });
};