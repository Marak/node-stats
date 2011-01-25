/*
 * parser.js: Parses and sanitizes IRC logs  
 *
 * (C) 2010 Marak Squires and Charlie Robbins
 * MIT LICENSE
 *
 */

var fs = require('fs'),
    eyes = require('eyes'),
    path = require('path'),
    winston = require('winston');

var options = exports.options = {
  "logPath" : path.join(__dirname, '..', '..', 'data', 'irc-logs', 'raw')
};

var lexer = /^(\[\d{2}\:\d{2}\])\s(\S+)\:(.*)/;

var parseAll = exports.parseAll = function (callback) {
  fs.readdir(options.logPath, function (err, files) {
    if (err) return callback(err);
    
    var hasErr = false, results = [];
    
    function parseNext () {
      if (files.length === 0) return callback(null, results);
      
      var file = files.shift(),
          fullPath = path.join(options.logPath, file);
      
      parseFile(fullPath, function (err, parsed) {
        if (err || hasErr) {
          hasErr = true;
          return;
        }

        results.push({ filename: file, results: parsed });
        parseNext();
      });
    }
    
    parseNext();    
  });
};

var parseFile = exports.parseFile = function (filename, callback) {
  winston.silly('Parsing file: ' + filename);
  fs.readFile(filename, function (err, data) {
    if (err) return callback(err);
    
    var lines = data.toString().split('\n'), results = [];
    lines.forEach(function (line) {
      var match;
      if ((match = line.match(lexer))) {
        match.shift();
        results.push({
          time: match[0].replace('[', '').replace(']', ''),
          user: match[1],
          message: match[2].trim()
        });
      }
    });
    
    
    callback(null, results);
  })
};