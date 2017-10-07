import QRCode from 'qrcode'

import defaultConfig from './defaultConfig'
import { encodeEthereumUri, decodeEthereumUri } from './uriProcessor'

/**
 * Main plugin logic
 */
class EthereumQRPlugin {
  /**
   *
   * Generates a data encode string
   *
   * @public
   * @param {Object} config
   * @returns String
   */
  toAddressString(config) {
    return this.produceEncodedValue(config)
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
    const generatedValue = this.produceEncodedValue(config, options)
    const parentEl = document.querySelector(options.selector)

    if (!options.selector || parentEl === null) {
      throw new Error('The canvas element parent selector is required when calling `toCanvas`')
    }

    return new Promise((resolve, reject) => {
      QRCode.toCanvas(generatedValue, this.options, (err, canvas) => {
        if (err) return reject(err)

        parentEl.innerHTML = null
        parentEl.appendChild(canvas)
        canvas.setAttribute('style', `width: ${this.size}px`)

        return resolve({ value: generatedValue })
      })
    })
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
    const generatedValue = this.produceEncodedValue(config, options)

    return new Promise((resolve, reject) => {
      QRCode.toDataURL(generatedValue, this.options, (err, url) => {
        if (err) reject(err)

        resolve({
          dataURL: url,
          value: generatedValue,
        })
      })
    })
  }

  /**
   * implements backwards transformation encode query string to JSON
   *
   * @param {String} valueString
   */
  readStringToJSON(valueString) { // eslint-disable-line class-methods-use-this
    return decodeEthereumUri(valueString)
  }

  getJSON() {
    return JSON.stringify(this.readStringToJSON())
  }

  produceEncodedValue(config, options) {
    this.assignPluguinValues(options)

    return encodeEthereumUri(config)
  }

  assignPluguinValues(request = {}) {
    const { options, size, toJSON, imgUrl } = request
    const qrSize = parseInt(size, 10)

    this.toJSON = !!toJSON
    this.size = (size && (qrSize > 0)) ? qrSize : defaultConfig.size
    this.imgUrl = imgUrl || false
    this.options = Object.assign({}, defaultConfig.options, options)
  }
}

export default EthereumQRPlugin
