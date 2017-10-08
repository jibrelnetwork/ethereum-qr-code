'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _qrcode = require('qrcode');

var _qrcode2 = _interopRequireDefault(_qrcode);

var _defaultConfig = require('./defaultConfig');

var _defaultConfig2 = _interopRequireDefault(_defaultConfig);

var _uriProcessor = require('./uriProcessor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Main plugin logic
 */
var EthereumQRPlugin = function () {
  function EthereumQRPlugin() {
    _classCallCheck(this, EthereumQRPlugin);
  }

  _createClass(EthereumQRPlugin, [{
    key: 'toAddressString',

    /**
     *
     * Generates a data encode string
     *
     * @public
     * @param {Object} config
     * @returns String
     */
    value: function toAddressString(config) {
      return this.produceEncodedValue(config);
    }

    /**
     *
     * Draws QR code to canvas tag inside specified DOM selector
     *
     * @public
     * @param {Object} config
     * @returns Promise
     */

  }, {
    key: 'toCanvas',
    value: function toCanvas(config, options) {
      var _this = this;

      var generatedValue = this.produceEncodedValue(config, options);
      var parentEl = document.querySelector(options.selector);

      if (!options.selector || parentEl === null) {
        throw new Error('The canvas element parent selector is required when calling `toCanvas`');
      }

      return new Promise(function (resolve, reject) {
        _qrcode2.default.toCanvas(generatedValue, _this.options, function (err, canvas) {
          if (err) return reject(err);

          parentEl.innerHTML = null;
          parentEl.appendChild(canvas);
          canvas.setAttribute('style', 'width: ' + _this.size + 'px');

          return resolve({ value: generatedValue });
        });
      });
    }

    /**
     *
     * Generates DataURL for a QR code
     *
     * @public
     * @param {Object} config
     * @returns Promise
     */

  }, {
    key: 'toDataUrl',
    value: function toDataUrl(config, options) {
      var _this2 = this;

      var generatedValue = this.produceEncodedValue(config, options);

      return new Promise(function (resolve, reject) {
        _qrcode2.default.toDataURL(generatedValue, _this2.options, function (err, url) {
          if (err) reject(err);

          resolve({
            dataURL: url,
            value: generatedValue
          });
        });
      });
    }

    /**
     * implements backwards transformation encode query string to JSON
     *
     * @param {String} valueString
     */

  }, {
    key: 'readStringToJSON',
    value: function readStringToJSON(valueString) {
      // eslint-disable-line class-methods-use-this
      return (0, _uriProcessor.decodeEthereumUri)(valueString);
    }
  }, {
    key: 'getJSON',
    value: function getJSON() {
      return JSON.stringify(this.readStringToJSON());
    }
  }, {
    key: 'produceEncodedValue',
    value: function produceEncodedValue(config, options) {
      this.assignPluguinValues(options);

      return (0, _uriProcessor.encodeEthereumUri)(config);
    }
  }, {
    key: 'assignPluguinValues',
    value: function assignPluguinValues() {
      var request = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = request.options,
          size = request.size,
          toJSON = request.toJSON,
          imgUrl = request.imgUrl;

      var qrSize = parseInt(size, 10);

      this.toJSON = !!toJSON;
      this.size = size && qrSize > 0 ? qrSize : _defaultConfig2.default.size;
      this.imgUrl = imgUrl || false;
      this.options = Object.assign({}, _defaultConfig2.default.options, options);
    }
  }]);

  return EthereumQRPlugin;
}();

exports.default = EthereumQRPlugin;