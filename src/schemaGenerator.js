import stringFunctions, {
    isAddress,
    validateSignature,
    validateArgsDefaults,
    listOfValidERC20Modes
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
            throw new Error('The "to" parameter with a valid Ethereum adress is required');
        }
    }

    validateAndSetMode(request) {
        if(request.mode === null || typeof request.mode === 'undefined'){
            this.mode = 'eth';
        } else if (request.mode && request.mode === 'function') {
            return this.validateFunctionMode(request);
        } else if (request.mode && request.mode.indexOf('erc20') > -1) {
            return this.validateErc20Mode(request);
        } else {
            throw new Error('Invalid "mode" provided');
        }
    }

    validateFunctionMode(request) {
        if (request.functionSignature && validateSignature(request.functionSignature)) {
            this.mode = 'function';
            this.data.functionSignature = JSON.parse(unescape(request.functionSignature));

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
        if (listOfValidERC20Modes.indexOf(request.mode) == -1) {
            throw new Error('Wrong `erc20__*` mode name provided');
        }

        if (request.from && isAddress(request.from)) {
            this.mode = 'erc20';
            this.data.from = request.from;
            this.data.argsDefaults = request.argsDefaults;
        } else {
            throw new Error('For the `erc20__*` mode, the `from` object is not provided or not valid');
        }
    }
}