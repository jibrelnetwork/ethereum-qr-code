import QRCode from 'qrcode';

import DEFAULTS from './defaults';
import { encodeEthereumUri, decodeEthereumUri } from './uri_processor';

/**
 * Main plugin logic
 */
class EthereumQRplugin {
  /**
     *
     * Generates a data encode string
     *
     * @public
     * @param {Object} config
     * @returns String
     */
  toAddressString(config) {
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
  toCanvas(config, options) {
    const generatedValue = this.produceEncodedValue(config, options);
    const parentEl = document.querySelector(options.selector);

    if (!options.selector || parentEl === null) {
      throw new Error('The canvas element parent selector is required when calling `toCanvas`');
    }

    return new Promise((resolve, reject) => {
      QRCode.toCanvas(generatedValue, this.options, (err, canvas) => {
        if (err) reject(err);

        resolve({
          value: generatedValue,
        });
        parentEl.appendChild(canvas);
        canvas.setAttribute('style', `width: ${this.size}px`);
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
  toDataUrl(config, options) {
    const generatedValue = this.produceEncodedValue(config, options);

    return new Promise((resolve, reject) => {
      QRCode.toDataURL(generatedValue, this.options, (err, url) => {
        if (err) reject(err);
        resolve({
          dataURL: url,
          value: generatedValue,
        });
      });
    });
  }

  /**
   * implements backwards transformation encode query string to JSON
   *
   * @param {String} valueString
   */
  static readStringToJSON(valueString) {
    return decodeEthereumUri(valueString);
  }
  getJSON() {
    return JSON.stringify(this.readStringToJSON());
  }
  produceEncodedValue(config, options) {
    this.assignPluguinValues(options);
    return encodeEthereumUri(config);
  }

  assignPluguinValues(request = {}) {
    this.toJSON = !!request.toJSON;
    this.size = (request.size && parseInt(request.size, 10) > 0) ? parseInt(request.size, 10) : DEFAULTS.size;
    this.imgUrl = request.imgUrl || false;
    this.options = Object.assign(DEFAULTS.qrCodeOptions, request.options);
  }
}

export default EthereumQRplugin;
