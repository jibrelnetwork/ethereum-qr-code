
import stringFunctions, {
    isAddress,
    validateSignature
} from './utils';
import DEFAULTS from './defaults';

export default class SchemaGenerator {
    constructor(request){
        this.data = {};
        this.parseRequest(request);
    }
    generateString() {
        return this.schemaGenerator(this.data)
    }
    generateJSON() {
        return JSON.stringify(this.data);
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
        if (parseFloat(request.value)) this.data.value = parseFloat(request.value);
        this.schemaGenerator = stringFunctions[this.mode];
    }
    validateToField(requestTo) {
        if (!requestTo || !isAddress(requestTo)) {
            throw new Error('The "to" parameter with a valid Etherium adress is required');
        }
    }

    validateAndSetMode(request) {

        if (request.mode === 'function') {
            if (request.functionSignature && validateSignature(request.functionSignature)) {
                this.mode = 'function';
                this.data.functionSignature = request.functionSignature;
                return;
            } else {
                throw new Error('For the `function` mode, the `functionSignature` object is not provided or not valid');
            }
        }

        if (request.mode === 'erc20') {
            if (request.from && isAddress(request.from) && request.value) {
                this.mode = 'erc20';
                this.data.from = request.from;
                return;
            } else {
                throw new Error('For the `erc20` mode, the `from` object is not provided or not valid');
            }
        }

        this.mode = 'eth';
    }
}