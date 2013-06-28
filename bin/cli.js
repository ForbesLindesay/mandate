#!/usr/bin/env node
"use strict"

var fs = require('fs')
var path = require('path')

var optimist = require('optimist')
var toml = require('toml').parse

var mandate = require('../')

optimist = optimist
  .usage('Usage: mandate <source> options')
  .boolean('help')
  .alias('help', 'h')
  .describe('help', 'Display usage information.')
  .string('filter')
  .alias('filter', 'grep')
  .alias('filter', 'f')
  .alias('filter', 'g')
  .describe('filter', 'Filter the paths to be uploaded using glob style strings')
  .string('bucket')
  .alias('bucket', 'b')
  .string('key')
  .alias('key', 'k')
  .string('secret')
  .alias('secret', 's')
  .string('region')
  .alias('region', 'r')
  .default('region', 'us-west-2')

var argv = optimist.argv

if (process.argv.length === 2) {
  var str
  try {
    str = fs.readFileSync('.mandate.toml')
  } catch (ex) {
    console.log(ex.stack)
    optimist.showHelp()
    process.exit(1)
  }
  var input = toml(str)
  uploadSite(input.source || process.cwd(), input.aws, input.options)
} else if (argv.help) {
  optimist.showHelp()
  process.exit(0)
} else {
  uploadSite(argv._[0], argv, argv)
}

function uploadSite(source, aws, options) {
  mandate(source, aws, options, function (err) {
    if (err) throw err
    console.log('uploaded')
    process.exit(0)
  })
}