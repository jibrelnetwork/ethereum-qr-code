import DrawIcon from './tokenIcon';
import stringFunctions, {
    isAddress,
    validateSignature
} from './utils';
import QRCode from 'qrcode';

const DEFAULTS = {
    value: 0,
    gas: 10000,
    size: 128,
    qrCodeOptions: {
        color: {
            dark: '#000000',
            light: '#ffffff'
        },
        scale: 5
    }
}
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
        this.parseRequest(config);
        return this.produceEncodedValue();
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
        this.parseRequest(config);
        const generatedValue = this.produceEncodedValue();
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
        this.parseRequest(config);
        const generatedValue = this.produceEncodedValue();

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

    getString() {
        return this.schemaGenerator(this.data);
    }
    getJSON() {
        return JSON.stringify(this.data);
    }
    produceEncodedValue() {
        return this.toJSON ? this.getJSON() : this.getString();
    }
    parseRequest(request) {
        this.validateToField(request.to);
        this.validateAndSetMode(request);
        this.assignPluguinValues(request);
    }
    assignPluguinValues(request) {
        this.data = {};
        this.data.to = request.to;
        this.data.gas = parseInt(request.gas) || DEFAULTS.gas;
        this.toJSON = !!request.toJSON;
        this.size = request.size || DEFAULTS.size;
        this.imgUrl = request.imgUrl || false;
        this.options = Object.assign(DEFAULTS.qrCodeOptions, request.options);
        this.schemaGenerator = stringFunctions[this.mode];
    }
    validateToField(requestTo) {
        if (!requestTo || !isAddress(requestTo)) {
            this.errorCallback('The "to" parameter with a valid Etherium adress is required');
        }
    }
    validateAndSetMode(request) {

        if (request.mode === 'function') {
            if (request.functionSignature && validateSignature(request.functionSignature)) {
                this.mode = 'function';
                this.data.functionSignature = request.functionSignature;
                return;
            } else {
                this.errorCallback('For the `function` mode, the `functionSignature` object is not provided or not valid');
            }
        }

        if (request.mode === 'erc20') {
            if (request.from && isAddress(request.from) && request.value) {
                this.mode = 'erc20';
                this.data.from = request.from;
                if (parseFloat(request.value)) this.data.value = parseFloat(request.value);
                return;
            } else {
                this.errorCallback('For the `erc20` mode, the `from` object is not provided or not valid');
            }
        }

        this.mode = 'eth';
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