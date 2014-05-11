var tmp = require('tmp'),
    denodeify = require('rsvp').denodeify,
    path = require('path'),
    chokidar = require('chokidar'),
    Renderer = require('../lib/renderer');


function Presentation (folder) {
  this._folder = folder;
}


Presentation.prototype = {
  open: function () {
    var that = this;

    return createTempFile.call(that)
            .then(createRenderer.bind(that))
            .then(watchForChanges.bind(that)).then(function () {
              return that._renderingTarget;
            });
  },

  render: function () {
    return this._renderer.render().then(notifyChanges.bind(this));
  },

  close: function () {
    this._watcher.close();
  }
};



function createTempFile () {
  var that = this,
      tmpFileTemplate = path.join(this._folder, '/.revelar-slides-XXXXXX-.html');

  return denodeify(tmp.file).call(tmp, { template: tmpFileTemplate }).then(function (filename) {
    that._renderingTarget = filename;
  });
}


function createRenderer () {
  this._renderer = new Renderer('/Users/paulo/Dropbox/palestrando/react', this._renderingTarget);
}


function watchForChanges () {
  var watcher = chokidar.watch(this._folder, { ignored: /revelar\-slides/ });
  watcher.on('all', this.render.bind(this));
  this._watcher = watcher;
}


function notifyChanges () {
  return this.onChange && this.onChange();
}


module.exports = Presentation;
