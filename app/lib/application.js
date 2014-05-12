var Presentation = require('./presentation');


function Application (options) {
  this._presentationContainer = options.presentationContainer;
  this._presentation = null;
}


Application.prototype = {
  openPresentation: function (slidesFolder) {
    // close previous presentation
    if (this._presentation) { this._presentation.close(); }

    this._presentation = new Presentation(slidesFolder);
    this._presentation.open().then(firstRender.bind(this)).then(refresh.bind(this));
    this._presentation.onChange = refresh.bind(this);
  }
};


function firstRender (targetFile) {
  this._presentationContainer.src = 'file://' + targetFile;
  return this._presentation.render();
}



function refresh () {
  setTimeout(function () {
    this._presentationContainer.contentWindow.location.reload();
  }.bind(this), 10);
}


module.exports = Application;
