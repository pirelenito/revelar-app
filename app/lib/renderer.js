var ejs = require('ejs'),
    fs = require('fs'),
    path = require('path'),
    rsvp = require('rsvp'),
    denodeify = rsvp.denodeify;


function Renderer (slidesFolder, targetFile) {
  this._targetFile = targetFile;
  this._slidesFolder = slidesFolder;
  this._configPath = path.join(slidesFolder, 'revelar_config.json');
  this._templatePath = path.join(__dirname, '../templates/reveal-js-index.ejs');
  this._revealRootPath = path.join(__dirname, '../node_modules/reveal.js/');
  this._appRoot = path.join(__dirname, '../');
}


Renderer.prototype = {
  render: function () {
    return loadConfig.call(this)
              .then(loadTemplate.bind(this))
              .then(loadSlidesFiles.bind(this))
              .then(renderSlides.bind(this));
  }
};


function renderSlides () {
  var that = this;

  var content = that._template({
    revealRoot: that._revealRootPath,
    appRoot: that._appRoot,
    config: that._config,
    slides: that._slidesFiles
  });

  return denodeify(fs.writeFile).call(fs, that._targetFile, content, { encoding: 'utf8' });
}


function loadTemplate () {
  var that = this;

  return denodeify(fs.readFile).call(fs, that._templatePath, { encoding: 'utf8' }).then(function (content) {
    that._template = ejs.compile(content);
  });
}


function loadSlidesFiles () {
  var that = this;

  return denodeify(fs.readdir).call(fs, that._slidesFolder).then(function (slides) {
    return slides.filter(function (slidePath) {
      return slidePath.toLowerCase().match(/(\.md)|(\.markdown)/);
    }).sort();
  }).then(null, function () {
    return [];
  }).then(function (slidesFiles) {
    slidesFiles = slidesFiles.map(function (file) {
      return path.join(that._slidesFolder, file);
    });

    that._slidesFiles = slidesFiles;
  });
}


function loadConfig () {
  var that = this;

  return denodeify(fs.readFile).call(fs, that._configPath).then(function (data) {
    return JSON.parse(data);
  }).then(null, function () {
    return {
      theme: 'default'
    };
  }).then(function (config) {
    that._config = config;
  });
}

module.exports = Renderer;
