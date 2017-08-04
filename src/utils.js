const tokenSchemaBasic = (adress, gas, data) => {
  return `ethereum:${adress}?gas=${gas}&data=${data}`;
}
const tokenSchemaFunction = (adress, gas, value, functionName, functionArguments) => {
  return ` ethereum:${adress}[?value=${value}][?gas=${gas}][?function=${functionName}(${functionArguments})]`;
}
const tokenSchemaContract = (adress, gas, contract) => {
  return `ethereum:${adress}?gas=${gas}&contract=${contract}`;
}

export default {
  eth: tokenSchemaBasic,
  function: tokenSchemaFunction,
  erc20: tokenSchemaContract
}

const validateArgument = (arg) => {
    
}

export const validateSignature = (signature) => {
    if(!signature.name || !signature.args) return false;
    
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
    address = address.replace('0x','');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};