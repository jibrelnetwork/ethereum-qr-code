# Etherium adress QR generator

Pugin is aimed to implement the convenient way to generate a [Etherium adress link out of the provided parameters based on EIP67](https://github.com/ethereum/EIPs/issues/67).
On top of the string generation the QR code is generated based on this link. The [qrcode plugin](https://www.npmjs.com/package/qrcode) is used for this.


## Getting started

 1. Install from NPM: `npm install ethereum-qr-code --save`

 2. Use in your code

```
import EtheriumQRplugin from 'ethereum-qr-code';

// later in code
const qr = new EtheriumQRplugin(codeContainer);
const qrCode = qr.toCanvas({
    selector: '#my-qr-code',
    to,
    gas
});

```

## Usage

### API

`.toCanvas(config)`

Generates the canvas tag with QR code. In this case the `selector` field becomes available.
Returns a Promise that is an object that is resolved when the code is successfully generated.
Example : 

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
Example : 

```
const qrCode = qr.toDataUrl({
    adres,
    gas,
    amount
});
qrCode.then(function(qrCodeDataUri){
    console.log('Your QR id generated:', code.value);
    // 
})
```

`.toAdressString(config)`

Mother if you only want an encode string

### Parameters

Parameters are passed vie one configutation object. It has following fields:

 1. `to` | String | required - The adress of the transaction

 2. `from` | String | optional - Adress where the transaction should be sent.

 3. `value` | Number | optional - Amount of ETH sent. Measured in `wei`. Defaults to 0.

 4. `gas` | Number | optional - Recomended amount of gas in `wei`. Defaults to 10000.

 5. `mode` | String | optional - Adress type to generate. Possible values: eth, function, erc20

 - `eth` - Ether transfer (default)
 - `function` - Call function of a contract.
 - `erc20` - Tokens transfer. Examples of using `mode = erc20`: `transfer(address to, uint value)`, `approve(address spender, uint value)`, `balanceOf(address to)`;

 6. `functionSignature` | String | optional - Becomes required in case of `mode = function`. Then the follwing string us encoded: `ethereum:<address>[?value=<value>][?gas=<gas>][?function=<functionSignature.name>(<functionSignature.args>)]`

 7. `selector` | String | optional

 If you want the pugin to generate the canvas tag with QR code and place in into you page DOM, you need to provide the DOM element selector.

 8. `options` | Object | optional

Allows to [override extra options](https://www.npmjs.com/package/qrcode#options-9) of the used qrcore plugin. Such as color, margin and scale. Be carefull with that `option.scale` because by default the value is selected by the plugin automatically based on the lanth of the data. If being set by hand may result in an error.


## Contact us

We will be glad to hear from you via [https://join.slack.com/jibrelnetwork/signup](slack.com/jibrelnetwork)

Follow us on Twitter: [https://twitter.com/JibrelNetwork](@JibrelNetwork).

If you have a proposal or a came across some problems running the plugin please [submit an issue](https://github.com/jibrelnetwork/ethereum-qr-code/issues).


Developed by Qubist Labs, 2017

## License 

[MIT](LICENSE.md)