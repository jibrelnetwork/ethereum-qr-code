const tokenSchemaBasic = ({
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
 * generate string: ethereum:${to}${gasBlock}${valueBlock}${gasBlock}`
 * @param {*} param0 
 */
const tokenSchemaFunction = ({
    to,
    gas,
    value,
    functionSignature
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
//todo add other params ??
const tokenSchemaContract = ({
    to,
    gas,
    contract
}) => {
    let base = `ethereum:${to}`,
        gasBlock = '',
        contractBlock = '';

    if (gas) gasBlock = `[?gas=${gas}]`;
    if (contract) contractBlock = `[?contract=${contract}]`;

    return `ethereum:${to}${gasBlock}${contractBlock}`;
}

export default {
    eth: tokenSchemaBasic,
    function: tokenSchemaFunction,
    erc20: tokenSchemaContract
}

const validStrRegEx = /^[^\\\/&]*$/;

const isValidString = str => str && str.length > 0 && str.match(validStrRegEx);

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
 * },
 * ..
 * 
 */
export const validateSignature = (signature) => {
    if (signature.name === null || typeof signature.name === 'undefined') return false;
    if (signature.payable === null || typeof signature.payable === 'undefined') return false;
    if (!signature.args || signature.args.length === 0) return false;
    let allArgsCheck = false;
    signature.args.forEach(arg => {
        if (!isValidString(arg.type) || !isValidString(arg.name)) allArgsCheck = false;
    })
    return allArgsCheck;
}

/**
 * Checks if the given string is an address
 * from ethereum.stackexchange.com/questions/1374/how-can-i-check-if-an-ethereum-address-is-valid
 * 
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
export const isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return true;
        //todo - need to add SHA 
        //https://github.com/ethereum/go-ethereum/blob/aa9fff3e68b1def0a9a22009c233150bf9ba481f/jsre/ethereum_js.go
        //return isChecksumAddress(address);
    }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
 */
export const isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x', '');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};