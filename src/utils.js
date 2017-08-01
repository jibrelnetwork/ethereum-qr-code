export const tokenSchemaEIP67 = (adress, gas, data) => {
  return `ethereum:${adress}?gas=${gas}&data=${data}`;
}
export  const tokenSchemaBitcoin = (adress, token, amount, standart = 'erc20') => {
  return `etheriumtoken:${standart}:${token}:${adress}:${amount}`;
}