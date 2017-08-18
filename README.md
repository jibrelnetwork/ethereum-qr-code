# Ethereum Address QR Generator

This plugin provides a convenient way to generate an [ethereum address link out of the provided parameters based on EIP67](https://github.com/ethereum/EIPs/issues/67).

The plugin generates the string based on the provided parameters and translates it into a QR code using the following [qrcode plugin](https://www.npmjs.com/package/qrcode).

Demo: [https://jibrelnetwork.github.io/ethereum-qr-code/](https://jibrelnetwork.github.io/ethereum-qr-code/)


## Getting started

 1. Install from NPM: `npm install ethereum-qr-code --save`

 2. Use in your code

```
import EthereumQRplugin from 'ethereum-qr-code';

// later in code
const qr = new EthereumQRplugin(codeContainer);
const qrCode = qr.toCanvas({
    selector: '#my-qr-code',
    to,
    gas
});

```

## Usage

### API

**`.toAddressString(config)`**

Just an encoder to translate your data into a string. Use if you want to generate a string.

Example:

```
qr.toAddressString({
“to”: 0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8,
“value”: 100,
})
//ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8[?gas=21000][?value=100]

qr.toAddressString({
    “to”: 0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8,
    “value”: 10,
    “gas”: 42000,
})
//ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8[?gas=42000][?value=10]
```


**`.toCanvas(config)`**

Generates the canvas tag with QR code. In this case the `selector` field becomes available.
Returns a Promise object that is resolved when the code is successfully generated.

Example:

```
const qrCode = qr.toCanvas({
    selector: '#my-qr-code',
    to,
    gas
});
qrCode.then(function(code){
    console.log('Your QR is generated!');
    console.log(code.value);
})
```


**`.toDataUrl(config)`**

More flexible method that returns a QR in a dataUrl.
Method returns a Promise that is resolved when the code is successfully generated.

Example:

```
const qrCode = qr.toDataUrl({
    adres,
    gas,
    amount
});
qrCode.then(function(qrCodeDataUri){
    console.log('Your QR id generated:', code.value); //'data:image/png;base64,iVBORw0KGgoA....'
})
```


**`.readStringToJSON(string)`**

A method to convert the EIP67 string back to the JSON object.

Example:

```
const paymentParams = qr.readStringToJSON(ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8[?gas=4200][?value=150]');
console.log(paymentParams);
/*
{
    to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
    gas: '4200',
    value: '150'
  }
*/
```

## URI schemes

This QR code generator supports URI across different use-cases:
1. Sending ETH
2. Invoking function of a contract
3. Sending `ERC20` tokens

We cover these 3 different cases using a parameter called 'mode'. The details are outlined below.

### 1. Sending ETH

URI scheme used to send ETH between accounts conforms early `EIP67` proposals and Bitcoin scheme.
This is built to be backward compatible.

`ethereum:<address>[?from=<sender_address>][?value=<ethamount>][?gas=<suggestedGas>]`

Parameters:

 1. `to` | String | **required** - The address of the recipient account

 2. `from` | String | optional - Address of the tx sender. Defaults to current active account of the sender app

 3. `value` | Number | optional - Amount of ETH to send. Measured in `wei`. Defaults to 0.

 4. `gas` | Number | optional - Recommended amount of gas. Defaults to 21000.


No other values are needed for this simple case.
For 2 other types - there is one significant field `mode` that defines the structure of entire resulting JSON. URI scheme to invoke contract's function uses JSON to encode all needed parameters.
Possible values of field `mode`: 
- `function`
- `erc20__transfer`
- `erc20__approve`
- `erc20__transferFrom`

We'll go though those below.

### 2. Invoke function of a contract

That is done by using `"mode: "function"`.

Example for the method `transfer` of `ERC20` token:

```json
{
  "to": "0xcontractaddress",
  "from": "0xsenderaddress",
  "value": 0,
  "gas": 100000,
  "mode": "function",
  "functionSignature": {
    "name": "transfer",
    "payable": false,
    "args": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint"
      }
    ]
  },
  "argsDefaults": [
    {
      "name": "to",
      "value": "0xtokensrecipient"
    },
    {
      "name": "value",
      "value": 1000000000000000000
    }
  ]
}
```

Parameters:

 1. `to` | String | **required** - The address of the recipient account

 2. `from` | String | optional - Address of the tx sender. Defaults to current active account of the sender user

 3. `value` | Number | optional - Amount of ETH to send. Measured in `wei`. Defaults to 0.

 4. `gas` | Number | optional - Recommended amount of gas. Defaults to 21000.

 5. `mode` | String | **required** - Mode of invocation. Expected value: `function`

 6. `functionSignature` | Object | **required** - Object that defines signature of invoked function. It is used only if `"mode" == "function"`

    1. `name` | String | **required** - Name of the invoked function

    2. `payable` | Boolean | **required** - Defines whether function is able to receive ETH or not. (`value` should be zero if `false`)

    3. `args` | Array | **required** - Contains list of function`s arguments

        1. `type` | String | **required** - Type of the argument: `uint`, `uint8`, `int32`, `address`, `bool` and so on.

        2. `name` | String | **required** - Name of the argument. Used to generate GUI for the transaction.
        In fact, argument of Solidity function can be unnamed - this is OK if you develop a smart contract.
        But QR codes are used to pass tx details between different wallets and GUI must be nice.
        Therefore unnamed input fields in GUI are not possible. Therefore this parameter is required.

 7. `argsDefaults` | Array | optional - Array with default values for function arguments.

    1. `name` | String | **required** - Name of the argument. Should be equal to the name of one of arguments from `functionSignature`

    2. `value` | Any | **required** - Default value for the function argument


### 3. Template for `ERC20` tokens

The 3 extra subtypes were added since the ERC20 tokens are very popular.

To make it easier to send tokens between accounts we predefine function signatures for the methods from ERC20 specification:

  1. `"mode": "erc20__transfer"` will result in `function transfer(address to, uint value) returns (bool success)`
  2. `"mode": "erc20__approve"` => `function approve(address spender, uint value) returns (bool success)`
  3. `"mode": "erc20__transferFrom"` => `function transferFrom(address from, address to, uint value) returns (bool success)`

Example for `transfer` method:

```json
{
  "to": "0xcontractaddress",
  "from": "0xsenderaddress",
  "gas": 100000,
  "mode": "erc20__transfer",
  "argsDefaults": [
    {
      "name": "to",
      "value": "0xtokensrecipient"
    }
  ]
}
```

Functionally, this is equivalent to the previous example.

Parameters:

 1. `to` | String | **required** - The address of the recipient account

 2. `from` | String | optional - Address of the tx sender. Defaults to current active account of the sender user

 3. `gas` | Number | optional - Recommended amount of gas. Defaults to 21000.

 4. `mode` | String | **required** - Mode of invocation. Expected value: `erc20__transfer`, `erc20__approve`, `erc20__transferFrom`

 5. `argsDefaults` | Array | optional - Array with default values for function arguments.

    1. `name` | String | **required** - Name of the argument. Should be equal to the name of one of arguments from `functionSignature`

    2. `value` | Any | **required** - Default value for the function argument


### Parameters of QR code generation

Parameters are passed via one configuration object. It has following fields:

 1. `selector` | String | optional

 If you want the pugin to generate the canvas tag with QR code and place in into you page DOM, you need to provide the DOM element selector.

 2. `options` | Object | optional

Allows to [override extra options](https://www.npmjs.com/package/qrcode#options-9) of the used qrcore plugin. Such as color, margin and scale. Use `option.scale` with caution. The plugin selects a default value based on the length of the data. Manually setting may result in an error.


## Contact us

Contact us via [slack.com/jibrelnetwork](https://join.slack.com/jibrelnetwork/signup)

Or follow us on Twitter: [@JibrelNetwork](https://twitter.com/JibrelNetwork).

If you have a proposal, feature request, or are having trouble running the plugin,  please [submit an issue](https://github.com/jibrelnetwork/ethereum-qr-code/issues).


Developed by Qubist Labs Inc. / Jibrel Network (2017)

## License 

[MIT](LICENSE.md)
