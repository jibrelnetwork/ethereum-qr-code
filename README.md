# Ethereum Address QR Generator

This plugin implements a convenient way to generate a [ethereum address link out of the provided parameters based on EIP67](https://github.com/ethereum/EIPs/issues/67).

On top of the string generation the QR code is generated based on this link. The [qrcode plugin](https://www.npmjs.com/package/qrcode) is used for this.

See the demos: [https://jibrelnetwork.github.io/ethereum-qr-code/](https://jibrelnetwork.github.io/ethereum-qr-code/)


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

`.toAdressString(config)`

Just an encoder of your data to a string. Use if you only want an encode string, no QR code needed.

Example:

```
qr.toAdressString({
“to”: 0x12345,
“value”: 10000000,
})
//

qr.toAdressString({
    “to”: 0x12345,
    “value”: 10000000,
    “gas”: 21000,
})
//
```
`.toCanvas(config)`

Generates the canvas tag with QR code. In this case the `selector` field becomes available.
Returns a Promise that is an object that is resolved when the code is successfully generated.

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

`.toDataUrl(config)`

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
    console.log('Your QR id generated:', code.value);
})
```

### URI scheme

QR code generator supports URI for different use-cases:
- Sending ETH
- Invoke function of a contract
- Sending `ERC20` tokens


#### Sending ETH

URI scheme used to send ETH between accounts conforms early `EIP67` proposals and Bitcoin scheme.
This made for backward compatibility.

`ethereum:<address>[?from=<sender_address>][?value=<ethamount>][?gas=<suggestedGas>]`

Parameters:

 1. `to` | String | **required** - The address of the recipient account

 2. `from` | String | optional - Address of the tx sender. Defaults to current active account of the sender app

 3. `value` | Number | optional - Amount of ETH to send. Measured in `wei`. Defaults to 0.

 4. `gas` | Number | optional - Recommended amount of gas. Defaults to 21000.


#### Invoke function of a contract

URI scheme to invoke contract's function uses JSON to encode all needed parameters.
There is one significant field `mode` that specifies structure of entire JSON.
Possible values of field `mode`: `function`, `erc20__transfer`, `erc20__approve`, `erc20__transferFrom`

Let's consider using `"mode: "function"`.
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
    "arguments": [
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
  "argumentsDefaults": [
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

 5. `mode` | String | **required** - Mode of invocation. Possible values: `function`, `erc20__transfer`, `erc20__approve`, `erc20__transferFrom`

 6. `functionSignature` | Object | **required** - Object that defines signature of invoked function. It is used only if `"mode" == "function"`

    1. `name` | String | **required** - Name of the invoked function

    2. `payable` | Boolean | **required** - Defines whether function is able to receive ETH or not. (`value` should be zero if `false`)

    3. `arguments` | Array | **required** - Contains list of function`s arguments

        1. `type` | String | **required** - Type of the argument: `uint`, `uint8`, `int32`, `address`, `bool` and so on.

        2. `name` | String | **required** - Name of the argument. Used to generate GUI for the transaction.
        In fact, argument of Solidity function can be unnamed - this is OK if you develop a smart contract.
        But QR codes are used to pass tx details between different wallets and GUI must be nice.
        Therefore unnamed input fields in GUI are not possible. Therefore this parameter is required.

 7. `argumentsDefaults` | Array | optional - Array with default values for function arguments.

    1. `name` | String | **required** - Name of the argument. Should be equal to the name of one of arguments from `functionSignature`

    2. `value` | Any | **required** - Default value for the function argument


#### Template for `ERC20` tokens

ERC20 tokens are very popular.
To make it easier to send tokens between accounts we predefine function signatures for the methods from ERC20 specification:

  1. `"mode": "erc20__transfer"` - `function transfer(address to, uint value) returns (bool success)`
  2. `"mode": "erc20__approve"` - `function approve(address _spender, uint _value) returns (bool success)`
  3. `"mode": "erc20__transferFrom"` - `function transferFrom(address _from, address _to, uint _value) returns (bool success)`

Example for `transfer` method:

```json
{
  "to": "0xcontractaddress",
  "from": "0xsenderaddress",
  "gas": 100000,
  "mode": "erc20__transfer",
  "argumentsDefaults": [
    {
      "name": "to",
      "value": "0xtokensrecipient"
    }
  ]
}
```

Functionally this is equivalent of the previous example.

Parameters:

 1. `to` | String | **required** - The address of the recipient account

 2. `from` | String | optional - Address of the tx sender. Defaults to current active account of the sender user

 3. `gas` | Number | optional - Recommended amount of gas. Defaults to 21000.

 4. `mode` | String | **required** - Mode of invocation. Possible values: `function`, `erc20__transfer`, `erc20__approve`, `erc20__transferFrom`

 7. `argumentsDefaults` | Array | optional - Array with default values for function arguments.

    1. `name` | String | **required** - Name of the argument. Should be equal to the name of one of arguments from `functionSignature`

    2. `value` | Any | **required** - Default value for the function argument


### Parameters of QR code generation

Parameters are passed vie one configutation object. It has following fields:

 1. `selector` | String | optional

 If you want the pugin to generate the canvas tag with QR code and place in into you page DOM, you need to provide the DOM element selector.

 2. `options` | Object | optional

Allows to [override extra options](https://www.npmjs.com/package/qrcode#options-9) of the used qrcore plugin. Such as color, margin and scale. Be carefull with that `option.scale` because by default the value is selected by the plugin automatically based on the lanth of the data. If being set by hand may result in an error.


## Contact us

We will be glad to hear from you via [https://join.slack.com/jibrelnetwork/signup](slack.com/jibrelnetwork)

Follow us on Twitter: [https://twitter.com/JibrelNetwork](@JibrelNetwork).

If you have a proposal or a came across some problems running the plugin please [submit an issue](https://github.com/jibrelnetwork/ethereum-qr-code/issues).


Developed by Qubist Labs, 2017

## License 

[MIT](LICENSE.md)
