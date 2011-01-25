/*
 * analyzer.js: Analyze the results of the IRC logs  
 *
 * (C) 2010 Marak Squires and Charlie Robbins
 * MIT LICENSE
 *
 */

var winston = require('winston'); 

var sumByMonth = exports.sumByMonth = function (data) {
  var monthly = {};
  
  data.forEach(function (result) {
    var year = result.date.getFullYear(),
        month = result.date.getMonth() + 1;
        
    if (!monthly[year]) monthly[year] = {};
    if (!monthly[year][month]) monthly[year][month] = 0;
    
    winston.silly(result.filename + ': ' + result.results.length);
    monthly[year][month] += result.results.length;
  });
  
  return monthly;
};