const tokenSchemaBasic = (adress, gas, data) => {
  return `ethereum:${adress}?gas=${gas}&data=${data}`;
}
const tokenSchemaFunction = (adress, gas, value, functionName, functionArguments) => {
  return ` ethereum:${adress}[?value=${value}][?gas=${gas}][?function=${functionName}(${functionArguments})]`;
}
const tokenSchemaContract = (adress, gas, contract) => {
  return `ethereum:${adress}?gas=${gas}&contract=${contract}`;
}

const validateEthAdress = (adress) => true;

export default {
  eth: tokenSchemaBasic,
  function: tokenSchemaFunction,
  erc20: tokenSchemaContract
}