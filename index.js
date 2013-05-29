"use strict"

var fs = require('fs')
var join = require('path').join

var S3 = require('intimidate')

module.exports = mandate
function mandate(directory, config, options, callback) {
  if (typeof options === 'function' && callback === undefined) {
    callback = options
    options = undefined
  }
  options = options || {}
  var client = new S3(config)
  var dir = readdirp(directory, options.filter)
  client.uploadFiles(dir.filter(function (f) { return f.isFile() }).map(function (f) {
    return {src: f.fullPath, dest: f.path.substr(1)}
  }), callback)
}

function readdirp(dir, filter) {
  filter = makeFilter(filter)
  var result = []
  function rec(subdir) {
    var entries = fs.readdirSync(join(dir, subdir))
    var dirs = []
    for (var i = 0; i < entries.length; i++) {
      if (filter(subdir + '/' + entries[i])) {
        var stat = fs.statSync(join(dir, subdir, entries[i]))
        stat.path = subdir + '/' + entries[i]
        stat.fullPath = join(dir, subdir, entries[i])
        stat.name = entries[i]
        if (stat.isFile()) {
          result.push(stat)
        } else {
          dirs.push(stat)
        }
      }
    }
    for (var i = 0; i < dirs.length; i++) {
      result.push(dirs[i])
      rec(dirs[i].path)
    }
  }
  rec('')
  return result
}

function makeFilter(filter) {
  if (filter == null) return function () { return true }
  if (typeof filter === 'function') return filter
  if (typeof filter === 'string') {
    filter = new Minimatch(filter, {
      dot: true,
      nocase: true,
      nocomment: true
    })
    var res = function (path) { return filter.match(path) }
    res.negate = filter.negate
    return res
  }
  if (Array.isArray(filter) && filter.length != 0) {
    filter = filter.map(makeFilter)
    if (filter.every(function (f) { return f.negate })) {
      return function (path) {
        return filter.every(function (f) { return f(path) })
      }
    } else if (filter.every(function (f) { return !f.negate })) {
      return function (path) {
        return filter.some(function (f) { return f(path) })
      }
    }
  }
  throw new Error('The filter did not match any of the valid patterns')
}