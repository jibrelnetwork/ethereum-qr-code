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
        this.parseRequest(config);
        const generatedValue = this.produceEncodedValue();
        const parentEl = document.querySelector(config.selector);

        if (!config.selector || parentEl === null) {
            this.errorCallback('The canvas element parent selector is required when calling `toCanvas`');
        }

        return new Promise((resolve, reject) => {
             QRCode.toCanvas(generatedValue, this.options, (err, canvas) => {
                if (err) reject(err);
          
                resolve(generatedValue);
                parentEl.appendChild(canvas);
                canvas.setAttribute('style', `width: ${this.size}px`);
                successCallback(generatedValue);
            })
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
        this.parseRequest(config);
        const generatedValue = this.produceEncodedValue();

        return new Promise((resolve, reject) => {
            QRCode.toDataURL(generatedValue, this.options, (err, url) => {
                if (err) reject(err);
                resolve(url)
                this.successCallback(url);
            })
        });
    }
    errorCallback(){
        this.result.status = 'error';
        this.result.value = value;
        throw new Error(value);
    }
    successCallback(value){
        this.result.status = 'success';
        this.result.value = value;
    }
    produceEncodedValue(){
        let generatedCode = this.schemaGenerator(this.to,
                                                this.gas,
                                                this.value,
                                                this.functionSignature,
                                                this.functionArguments);
        const jsonRepresentation = {
            to: this.to,
            gas: this.gas,
            value: this.value,
            functionSignature: this.functionSignature,
            functionArguments: this.functionArguments
        };
        return this.toJSON ? JSON.stringify(jsonRepresentation) : generatedCode;
    }
    parseRequest(request) {
        this.result = {
            status: ''
        };

        if (!request.to || !isAddress(request.to)) {
            this.errorCallback('The "to" parameter with a valid Etherium adress is required');
        }

        if (request.mode) {
            if (request.mode === 'function' && request.functionSignature && request.functionArguments) {
                this.mode = 'function';
                this.functionSignature = request.functionSignature;
                this.functionArguments = request.functionArguments;
            } else if (request.mode === 'erc20' && request.from) {
                this.mode = 'erc20';
            } else {
                this.mode = 'eth';    
            }
        } else {
            this.mode = 'eth';
        }

        //todo use Object.assign
        this.to = request.to;
        this.from = request.from;
        this.value = parseFloat(request.value) || 0;
        this.gas = parseFloat(request.gas) || 10000;
        this.toJSON = request.toJSON ? request.toJSON === 'true' : false;
        this.size = request.size || 128;
        this.imgUrl = request.imgUrl || false;
        this.options = Object.assign({
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            scale: 5}, request.options);
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