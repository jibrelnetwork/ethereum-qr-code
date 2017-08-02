const tokenSchemaBasic = (adress, gas, data) => {
  return `ethereum:${adress}?gas=${gas}&data=${data}`;
}
const tokenSchemaFunction = (adress, gas, data) => {
  return `ethereum:${adress}?gas=${gas}&data=${data}`;
}
const tokenSchemaContract = (adress, gas, data) => {
  return `ethereum:${adress}?gas=${gas}&data=${data}`;
}

export default {
  eth: tokenSchemaBasic,
  function: tokenSchemaFunction,
  erc20: tokenSchemaContract
}