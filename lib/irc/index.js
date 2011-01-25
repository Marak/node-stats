/*
 * index.js: Top-level include for the IRC logs parsing / statistics module 
 *
 * (C) 2010 Charlie Robbins
 *
 */
 
var irc = exports;

irc.downloadOptions = require('./download').options;
irc.downloadAll     = require('./download').downloadAll;
irc.downloadFile    = require('./download').downloadFile;

irc.parserOptions   = require('./parser').options;
irc.parseAll        = require('./parser').parseAll;
irc.parseFile       = require('./parser').parseFile;
