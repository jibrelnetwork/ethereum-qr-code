import stringFunctions, {
    isAddress,
    validateSignature,
    validateArgsDefaults,
    validERC20Modes
} from './utils';
import DEFAULTS from './defaults';

export default class SchemaGenerator {
    constructor(request) {
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
        if (request.mode === 'function') return checkFunctionMode(request);
            
        if (request.mode.indexOf('erc20')) return validateErc20Mode(request);

        this.mode = 'eth';
    }

    validateFunctionMode(request) {
        if (request.functionSignature && validateSignature(request.functionSignature)) {
            this.mode = 'function';
            this.data.functionSignature = request.functionSignature;

            if (request.argsDefaults) {
                if (validateArgsDefaults(request.argsDefaults, request.functionSignature.args)) {
                    this.data.argsDefaults = request.argsDefaults;
                } else {
                    throw new Error('For the `function` mode, the `argsDefaults` object is properly formatted');
                }
            }
        } else {
            throw new Error('For the `function` mode, the `functionSignature` object is not provided or not valid');
        }
    }

    validateErc20Mode(request) {
        if(validERC20Modes.indexOf(request.mode) == -1){
            throw new Error('Wrong `erc20__*` mode name provided');
        }
        if (request.from && isAddress(request.from) && request.value) {
            this.mode = 'erc20';
            this.data.from = request.from;
            this.data.argsDefaults = request.argsDefaults;
        } else {
            throw new Error('For the `erc20` mode, the `from` object is not provided or not valid');
        }
    }
}