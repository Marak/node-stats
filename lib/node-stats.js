/*
 * node-stats.js: Top-level include for the 'node-stats' module 
 *
 * (C) 2010 Marak Squires and Charlie Robbins
 * MIT LICENSE
 *
 */
 
var winston   = require('winston'),
    nodeStats = exports;

//
// Set the level of the console transport to 'silly'
//
winston.defaultTransports()['console'].level = 'silly';

nodeStats.irc = require('./irc');