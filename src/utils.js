const validStrRegEx = /^[^\\\/&]*$/;

const isValidString = str => str && str.length > 0 && str.match(validStrRegEx);

export const listOfValidERC20Modes = [`erc20__transfer`, `erc20__approve`, `erc20__transferFrom`];

export const tokenSchemaBasic = ({
    to,
    gas,
    value
}) => {
    let base = `ethereum:${to}`,
        gasBlock = '',
        valueBlock = '';
    if (gas) gasBlock = `[?gas=${gas}]`;
    if (value) valueBlock = `[?value=${value}]`;

    return `ethereum:${to}${gasBlock}${valueBlock}`;
}
/**
 * generate string: ethereum:${to}${gasBlock}${valueBlock}`
 * @param {*} param0 
 */
const tokenSchemaFunction = ({
    to,
    gas,
    value,
    functionSignature,
    argsDefaults
}) => {
    let base = `ethereum:${to}`,
        functionBlock = '',
        gasBlock = '',
        valueBlock = '';

    if (functionSignature) {
        let convertedArgs = '',
        payable = !!functionSignature.payable ? ' payable' : '';
        functionSignature.args.forEach((arg, index) => {
            const isLast = index < functionSignature.args.length - 1 ? ',' : '';
            convertedArgs += `${arg.type} ${arg.name}${isLast}`;
        });
        functionBlock = `[?function=${functionSignature.name}${payable}(${convertedArgs})]`
    }
    if (gas) gasBlock = `[?gas=${gas}]`;
    if (value) valueBlock = `[?value=${value}]`;

    return `ethereum:${to}${gasBlock}${valueBlock}${functionBlock}`;
}


const validateArgsDefaults = (argsDefaults, functionArgs) => {
    if(!argsDefaults || argsDefaults.length !== functionArgs.length) return false;
    let argsDefaultsIsValid = true;
    functionArgs.forEach(arg => {
        const correspondingEl = argsDefaults.find(a => a.name === arg.name);
        if(!correspondingEl || !correspondingEl.value) argsDefaultsIsValid = false;
    })
    return argsDefaultsIsValid;
}
/**
 * the corect format e.g. is:
 * 
 * ..
 * functionSignature: {
 *      'name': 'myFunc',
 *      'payable': false,
 *      'args': [{
 *              'name': 'adress',
 *              'type': 'uint'
 *          }]
 * },`
 * 
 */
export const validateSignature = (signatureString) => {
    
    let signature;

    try {
        signature = JSON.parse(unescape(signatureString));
    } catch(e) {
        return false;
    }

    if (signature.name === null || typeof signature.name === 'undefined') return false;
    if (signature.payable === null || typeof signature.payable === 'undefined') return false;
    if (!signature.args || signature.args.length === 0) return false;
    let allArgsCheck = true;
    signature.args.forEach(arg => {
        if (!isValidString(arg.type) || !isValidString(arg.name)) allArgsCheck = false;
    })
    return allArgsCheck;
}

/**
 * Checks if the given string is an address
 * from ethereum.stackexchange.com/questions/1374/how-can-i-check-if-an-ethereum-address-is-valid
 * from https://github.com/ethereum/web3.js/blob/master/lib/utils/utils.js#L392
 * 
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
export const isAddress = (address) => /^0x[0-9a-f]{40}$/i.test(address);