import BigNumber from 'bignumber.js';
/**
 * Supported modes
 */

export const uriModes = {
  contractFunction: 'contract_function',
  erc20Transfer: 'erc20__transfer',
  erc20Approve: 'erc20__approve',
  erc20TransferFrom: 'erc20__transferFrom',
};


/**
 * Basic validators
 */

/**
 * Checks if the given string is an address
 * from ethereum.stackexchange.com/questions/1374/how-can-i-check-if-an-ethereum-address-is-valid
 * from https://github.com/ethereum/web3.js/blob/master/lib/utils/utils.js#L392
 *
 * @method isValidAddress
 * @param {String} address the given HEX address
 * @return {Boolean}
 */
const isValidAddress = (address) => /^0x[0-9a-f]{40}$/i.test(address);

const isValidEthValue = (value) => {
  const ethWeiValue = new BigNumber(value);
  return ethWeiValue.isInteger() && ethWeiValue >= 0;
};
const isValidGasAmount = (gas) => Number.isInteger(gas) && gas >= 0;
const isValidChainId = (chainId) => Number.isInteger(chainId) && chainId > 0;

const isValidContractFunctionName = (str) => str.length > 0 && /^[a-z0-9\-_]*$/i.test(str);
const isValidSolidityType = (str) => str.length > 0 && /^[a-z0-9]*$/.test(str);
const isValidFunctionArgumentName = (str) => str.length > 0 && /^[a-z0-9\-_]*$/i.test(str);

const isValueDefined = (val) => val !== null && typeof val !== 'undefined';
const isValidOptionalParam = (param, contentCheckFunc) => param === null || typeof param === 'undefined' ||
                                                          contentCheckFunc(param) === true;
const isValidRequiredParam = (param, contentCheckFunc) => param !== null && typeof param !== 'undefined' &&
                                                          contentCheckFunc(param) === true;
const validateAllowedProperties = (testObj, allowedProperties) => {
  Object.keys(testObj).forEach((propertyName) => {
    if (Object.prototype.hasOwnProperty.call(testObj, propertyName)) {
      if (allowedProperties.indexOf(propertyName) === -1) {
        throw new Error(`Not allowed property found: ${propertyName}! Allowed properties: ${allowedProperties}`);
      }
    }
  });
};


/**
 * Complex validators of URI
 */


/**
 * Check correctness of function signature
 */
const validateFunctionSignature = (signature) => {
  if (isValidRequiredParam(signature.name, isValidContractFunctionName) === false) {
    throw new Error(`Invalid function name: ${signature.name}`);
  }
  if (signature.payable !== true && signature.payable !== false) {
    throw new Error(`Invalid "payable" mark: ${signature.payable}`);
  }
  if (signature.args === null || typeof signature.args === 'undefined') {
    return;
  }
  if (Array.isArray(signature.args) === false) {
    throw new Error(`Function "args" should be an array: ${signature.args}`);
  }
  if (signature.args.length === 0) {
    throw new Error('Function "args" is an empty array. Do not use this property if function does not have arguments');
  }
  signature.args.forEach((functionArg) => {
    validateAllowedProperties(functionArg, ['name', 'type']);
    if (isValidRequiredParam(functionArg.name, isValidFunctionArgumentName) === false) {
      throw new Error(`Invalid "name" of function argument: ${functionArg.name}`);
    }
    if (isValidRequiredParam(functionArg.type, isValidSolidityType) === false) {
      throw new Error(`Invalid "type" of function argument: ${functionArg.name}`);
    }
  });
};

/**
 * Check correctness of default args for function arguments
 */
const validateArgsDefaults = (argsDefaults, functionArgs) => {
  if (argsDefaults === null || typeof argsDefaults === 'undefined') {
    return;
  }
  if (Array.isArray(argsDefaults) === false) {
    throw new Error(`"argsDefaults" should be an array: ${argsDefaults}`);
  }
  if (argsDefaults.length === 0) {
    throw new Error('"argsDefaults" is an empty array. Do not use this property if you do not have default values');
  }

  if (functionArgs === null || typeof functionArgs === 'undefined') {
    throw new Error(`"argsDefaults" provided while function does not have arguments: ${argsDefaults}`);
  }

  argsDefaults.forEach((argDefault) => {
    validateAllowedProperties(argDefault, ['name', 'value']);
    if (isValidRequiredParam(argDefault.name, isValidFunctionArgumentName) === false) {
      throw new Error(`Invalid "name" of function argument in "argsDefaults": ${argDefault.name}`);
    }
    if (isValueDefined(argDefault.value) === false) {
      // we do not check arg value, out of the scope of this library
      throw new Error(`Value of the function argument is not provided: ${argDefault.value}`);
    }
    const matchedArg = functionArgs.find((arg) => arg.name === argDefault.name);
    if (matchedArg === null || typeof matchedArg === 'undefined') {
      throw new Error(
        `"name" of the function argument with default value does not fit function signature: ${argDefault.name}`);
    }
  });
};

const validateUriSchemaBasic = (data) => {
  validateAllowedProperties(data, ['to', 'from', 'value', 'gas', 'chainId']);
  if (isValidRequiredParam(data.to, isValidAddress) === false) {
    throw new Error(`Property "to" is not an valid Ethereum address: ${data.to}`);
  }
  if (isValidOptionalParam(data.from, isValidAddress) === false) {
    throw new Error(`Property "from" is not an valid Ethereum address: ${data.from}`);
  }
  if (isValidOptionalParam(data.value, isValidEthValue) === false) {
    throw new Error(`Property "value" is not an valid Ethereum amount: ${data.value}`);
  }
  if (isValidOptionalParam(data.chainId, isValidChainId) === false) {
    throw new Error(`Property "chainId" is not an valid Ethereum chainId: ${data.chainId}`);
  }
  if (isValidOptionalParam(data.gas, isValidGasAmount) === false) {
    throw new Error(`Property "gas" is not an valid gas amount: ${data.gas}`);
  }
};

const validateUriSchemaFunction = (data) => {
  validateAllowedProperties(data, ['to', 'from', 'value', 'gas', 'mode', 'chainId', 'functionSignature', 'argsDefaults']);
  if (isValidRequiredParam(data.to, isValidAddress) === false) {
    throw new Error(`Property "to" is not an valid Ethereum address: ${data.to}`);
  }
  if (isValidOptionalParam(data.from, isValidAddress) === false) {
    throw new Error(`Property "from" is not an valid Ethereum address: ${data.from}`);
  }
  if (isValidOptionalParam(data.value, isValidEthValue) === false) {
    throw new Error(`Property "value" is not an valid Ethereum amount: ${data.value}`);
  }
  if (isValidOptionalParam(data.gas, isValidGasAmount) === false) {
    throw new Error(`Property "gas" is not an valid gas amount: ${data.gas}`);
  }
  if (isValidOptionalParam(data.chainId, isValidChainId) === false) {
    throw new Error(`Property "chainId" is not an valid Ethereum chainId: ${data.chainId}`);
  }
  if (data.mode !== uriModes.contractFunction) {
    throw new Error(`Chosen URI mode is not supported: ${data.mode}`);
  }
  if (isValueDefined(data.functionSignature) === false) {
    throw new Error('Property "functionSignature" is not defined');
  }
  validateFunctionSignature(data.functionSignature);
  if (isValueDefined(data.argsDefaults)) {
    validateArgsDefaults(data.argsDefaults, data.functionSignature.args);
  }
};

const validateUriSchemaERC20Transfer = (data) => {
  validateAllowedProperties(data, ['to', 'from', 'gas', 'mode', 'chainId', 'argsDefaults']);
  if (isValidRequiredParam(data.to, isValidAddress) === false) {
    throw new Error(`Property "to" is not an valid Ethereum address: ${data.to}`);
  }
  if (isValidOptionalParam(data.from, isValidAddress) === false) {
    throw new Error(`Property "from" is not an valid Ethereum address: ${data.from}`);
  }
  if (isValidOptionalParam(data.value, isValidEthValue) === false) {
    throw new Error(`Property "value" is not an valid Ethereum amount: ${data.value}`);
  }
  if (isValidOptionalParam(data.gas, isValidGasAmount) === false) {
    throw new Error(`Property "gas" is not an valid gas amount: ${data.gas}`);
  }
  if (isValidOptionalParam(data.chainId, isValidChainId) === false) {
    throw new Error(`Property "chainId" is not an valid Ethereum chainId: ${data.chainId}`);
  }
  if (data.mode !== uriModes.erc20Transfer) {
    throw new Error(`Chosen URI mode is not supported: ${data.mode}`);
  }
  if (isValueDefined(data.argsDefaults)) {
    validateArgsDefaults(data.argsDefaults,
                         [
                           {
                             name: 'to',
                             type: 'address',
                           },
                           {
                             name: 'value',
                             type: 'uint',
                           },
                         ]);
  }
};

const validateUriSchemaERC20Approve = (data) => {
  validateAllowedProperties(data, ['to', 'from', 'gas', 'mode', 'chainId', 'argsDefaults']);
  if (isValidRequiredParam(data.to, isValidAddress) === false) {
    throw new Error(`Property "to" is not an valid Ethereum address: ${data.to}`);
  }
  if (isValidOptionalParam(data.from, isValidAddress) === false) {
    throw new Error(`Property "from" is not an valid Ethereum address: ${data.from}`);
  }
  if (isValidOptionalParam(data.value, isValidEthValue) === false) {
    throw new Error(`Property "value" is not an valid Ethereum amount: ${data.value}`);
  }
  if (isValidOptionalParam(data.gas, isValidGasAmount) === false) {
    throw new Error(`Property "gas" is not an valid gas amount: ${data.gas}`);
  }
  if (isValidOptionalParam(data.chainId, isValidChainId) === false) {
    throw new Error(`Property "chainId" is not an valid Ethereum chainId: ${data.chainId}`);
  }
  if (data.mode !== uriModes.erc20Approve) {
    throw new Error(`Chosen URI mode is not supported: ${data.mode}`);
  }
  if (isValueDefined(data.argsDefaults)) {
    validateArgsDefaults(data.argsDefaults,
                         [
                           {
                             name: 'spender',
                             type: 'address',
                           },
                           {
                             name: 'value',
                             type: 'uint',
                           },
                         ]);
  }
};

const validateUriSchemaERC20TransferFrom = (data) => {
  validateAllowedProperties(data, ['to', 'from', 'gas', 'mode', 'chainId', 'argsDefaults']);
  if (isValidRequiredParam(data.to, isValidAddress) === false) {
    throw new Error(`Property "to" is not an valid Ethereum address: ${data.to}`);
  }
  if (isValidOptionalParam(data.from, isValidAddress) === false) {
    throw new Error(`Property "from" is not an valid Ethereum address: ${data.from}`);
  }
  if (isValidOptionalParam(data.value, isValidEthValue) === false) {
    throw new Error(`Property "value" is not an valid Ethereum amount: ${data.value}`);
  }
  if (isValidOptionalParam(data.gas, isValidGasAmount) === false) {
    throw new Error(`Property "gas" is not an valid gas amount: ${data.gas}`);
  }
  if (isValidOptionalParam(data.chainId, isValidChainId) === false) {
    throw new Error(`Property "chainId" is not an valid Ethereum chainId: ${data.chainId}`);
  }
  if (data.mode !== uriModes.erc20TransferFrom) {
    throw new Error(`Chosen URI mode is not supported: ${data.mode}`);
  }
  if (isValueDefined(data.argsDefaults)) {
    validateArgsDefaults(data.argsDefaults,
                         [
                           {
                             name: 'from',
                             type: 'address',
                           },
                           {
                             name: 'to',
                             type: 'address',
                           },
                           {
                             name: 'value',
                             type: 'uint',
                           },
                         ]);
  }
};


export const validateEthereumUri = (data) => {
  if (isValueDefined(data.mode) === false) {
    return validateUriSchemaBasic(data);
  } else if (data.mode === uriModes.contractFunction) {
    return validateUriSchemaFunction(data);
  } else if (data.mode === uriModes.erc20Transfer) {
    return validateUriSchemaERC20Transfer(data);
  } else if (data.mode === uriModes.erc20Approve) {
    return validateUriSchemaERC20Approve(data);
  } else if (data.mode === uriModes.erc20TransferFrom) {
    return validateUriSchemaERC20TransferFrom(data);
  }
  throw new Error(`Not supported URI mode: ${data.mode}`);
};


/**
 * Encoders
 */

const encodeEthSend = (data) => {
  const fromBlock = isValueDefined(data.from) ? `?from=${data.from}` : '';
  let valueBlock;
  if (isValueDefined(data.value)) {
    const weiValue = new BigNumber(data.value).toString(10);
    valueBlock = isValueDefined(data.value) ? `?value=${weiValue}` : '';
  }
  const gasBlock = isValueDefined(data.gas) ? `?gas=${data.gas}` : '';
  const chainIdBlock = (isValueDefined(data.chainId) && isValidChainId(data.chainId)) ? `?chainId=${data.chainId}` : '';
  return `ethereum:${data.to}${fromBlock}${valueBlock}${gasBlock}${chainIdBlock}`;
};

export const encodeEthereumUri = (data) => {
  validateEthereumUri(data); // throws if data has wrong format

  if (isValueDefined(data.mode) === false) {
    return encodeEthSend(data);
  }
  return JSON.stringify(data);
};


/**
 * Decoders
 */
const decodeEthSend = (encodedStr) => {
  const addressBlockParams = {
    gas: {
      convert(value) {
        return parseInt(value, 10);
      },
    },
    value: {
      convert(value) {
        return new BigNumber(value).toString(10);
      },
    },
    from: {
      convert(value) {
        return value;
      },
    },
    chainId: {
      convert(value) {
        return parseInt(value, 10);
      },
    },
  };

  const result = {};
  if (!encodedStr || encodedStr.substr(0, 9) !== 'ethereum:') {
    return false;
  }
  if (encodedStr.length >= 51 && isValidAddress(encodedStr.substr(9, 42))) {
    result.to = encodedStr.substr(9, 42);
  }
  if (encodedStr.length > 51) {
    const uriSegments = encodedStr.substr(51).split('?');
    uriSegments.shift();
    uriSegments.forEach((segment) => {
      const parts = segment.split('=');
      if (Object.keys(addressBlockParams).indexOf(parts[0]) > -1) {
        result[parts[0]] = addressBlockParams[parts[0]].convert(parts[1]);
      }
    });
  }
  return result;
};

export const decodeEthereumUri = (encodedStr) => {
  let data;
  try {
    data = JSON.parse(encodedStr);
  } catch (e) {
    // this is not a JSON, try to parse legacy format ETH send
  }
  if (typeof data === 'undefined') {
    data = decodeEthSend(encodedStr);
  }
  validateEthereumUri(data); // throws if data has wrong format
  return data;
};
