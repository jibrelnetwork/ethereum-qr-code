import DrawIcon from './tokenIcon';
import stringFunctions, {isAddress} from './utils';
import QRCode from 'qrcode';


/**
 * Main plugin logic
 */
class EtheriumQRplugin {
    /**
     * 
     * Draws QR code to canvas tag inside specific DOM selector
     *
     * @public 
     * @param {Object} config 
     * @returns void
     */
    toCanvas(config) {
        if (!config.selector) {
            throw new Error('The canvas element parent selector is required when calling `toCanvas`');
            return;
        }
        this.generate(config).then(function (qrCodeDataUri) {
            let canvas = document.createElement('canvas');
            const canvasContainer = document.querySelector(config.selector);
            canvasContainer.appendChild(canvas);
            var ctx = canvas.getContext('2d');
            var img = new Image;
            img.onload = function(){
                ctx.drawImage(img,0,0);
            };
            img.src = qrCodeDataUri;
        })
    }
    /**
     * 
     * Returns a QR code generation promise
     * 
     * @public
     * @param {Object} config 
     * @returns Promise
     */
    toDataUrl(config) {
        return this.generate(config)
    }

    generate(config) {
        this.parseRequest(config);
        let generatedCode = this.schemaGenerator(this.to,
                                                this.gas,
                                                this.value,
                                                this.functionName,
                                                this.functionArguments);
        this._resultString = generatedCode;
        let result = new Promise((resolve, reject) => {
            QRCode.toDataURL(generatedCode, this.options, function (err, url) {
                if (err) reject(err);
                resolve(url)
            })
        });

        return result;
    }
    parseRequest(request) {
        if (!request.to || !isAddress(request.to)) {
            throw new Error('The "to" parameter with a valid Etherium adress is required');
            return;
        }

        if (request.mode) {
            if (request.mode === 'function' && request.functionSignature && request.functionArguments) {
                this.mode = 'function';
            }
            if (request.mode === 'erc20' && request.from) {
                this.mode = 'erc20';
            }
        } else {
            this.mode = 'eth';
        }
        this._resultString = '';
        this.to = request.to;
        this.from = request.from;
        this.value = parseFloat(request.value) || 0;
        this.gas = parseFloat(request.gas) || 10000;
        this.toJSON = request.toJSON;
        this.size = request.size || 128;
        this.imgUrl = request.imgUrl || false;
        this.options = {
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            scale: 4
        };
        this.schemaGenerator = stringFunctions[this.mode];
    }
    drawTokenIcon() {
        if (this.imgUrl) {
            const iconDraw = new DrawIcon();
            iconDraw.addIcon(this.imgUrl, this.size, this.uiElement, () => {
                this.uiElement.parentNode.removeChild(this.uiElement);
            });
        }
    }
}

export default EtheriumQRplugin;