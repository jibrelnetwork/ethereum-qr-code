import DrawIcon from './tokenIcon';
import SchemaGenerator from './schemaGenerator';
import QRCode from 'qrcode';
import DEFAULTS from './defaults';

/**
 * Main plugin logic
 */
class EtheriumQRplugin {
    /**
     * 
     * Generates a data encode string
     * 
     * @public
     * @param {Object} config 
     * @returns String
     */
    toAdressString(config) {
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
    toCanvas(config) {
        const generatedValue = this.produceEncodedValue(config);
        const parentEl = document.querySelector(config.selector);

        if (!config.selector || parentEl === null) {
            this.errorCallback('The canvas element parent selector is required when calling `toCanvas`');
        }

        return new Promise((resolve, reject) => {
            QRCode.toCanvas(generatedValue, this.options, (err, canvas) => {
                if (err) reject(err);

                resolve({
                    value: generatedValue
                });
                parentEl.appendChild(canvas);
                canvas.setAttribute('style', `width: ${this.size}px`);
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
    toDataUrl(config) {
        const generatedValue = this.produceEncodedValue(config);

        return new Promise((resolve, reject) => {
            QRCode.toDataURL(generatedValue, this.options, (err, url) => {
                if (err) reject(err);
                resolve({
                    dataURL: url,
                    value: generatedValue
                });
            })
        });
    }

    getJSON() {
        return JSON.stringify( getString());
    }
    produceEncodedValue(config) {
        this.assignPluguinValues(config)
        const encodedString = new SchemaGenerator(config).generate();
        return this.toJSON ? JSON.stringify(encodedString) : encodedString;
    }

    assignPluguinValues(request) {
        this.toJSON = !!request.toJSON;
        this.size = request.size || DEFAULTS.size;
        this.imgUrl = request.imgUrl || false;
        this.options = Object.assign(DEFAULTS.qrCodeOptions, request.options);
    }

    drawTokenIcon() {
        if (this.imgUrl) {
            const iconDraw = new DrawIcon();
            iconDraw.addIcon(this.imgUrl, this.size, this.uiElement, () => {
                this.uiElement.parentNode.removeChild(this.uiElement);
            });
        }
    }
    errorCallback(errorText) {
        throw new Error(errorText);
    }
}

export default EtheriumQRplugin;