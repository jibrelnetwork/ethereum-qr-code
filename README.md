# Etherium adress QR generator

Pugin is aimed to implement the convenient way to generate a [Etherium adress link out of the provided parameters based on EIP67](https://github.com/ethereum/EIPs/issues/67).
On top of the string generation the QR code is generated based on this link. The [qrcode plugin](https://www.npmjs.com/package/qrcode) is used for this.


3 options of the string encoded possible:

```
ethereum:<address>[?value=<value>][?gas=<suggestedGas>][?function=nameOfFunction(param)]
```

## Getting started

 1. Install from NPM: `npm install ethereum-qr-code --save`

 2. Use in your code

```
import EtheriumQRplugin from 'ethereum-qr-code';

// later in code
const qr = new EtheriumQRplugin(codeContainer);
const qrCode = qr.toCanvas({
    selector: '#my-qr-code',
    adres,
    gas,
    amount
});

```

## Usage

### API

`.toCanvas(config)`

Generates the canvas tag with QR code. In this case the `selector` field becomes available.
Returns a Promise that is resolved when the code is successfully generated.
Example : 

```
const qrCode = qr.toCanvas({
    selector: '#my-qr-code',
    adres,
    gas,
    amount
});
qrCode.then(function(){
    console.log('Your QR is generated!');
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
    console.log('Your QR id generated:', toDataUrl);
})
```

### Parameters

Parameters are passed vie one configutation object. It has following fields:

 1. `to` | String | required
The adress of the transaction

 2. `from` | String | optional
Адрес откуда отправлять транзакцию. В случае контрактов это важно т.к. это единственный способ авторизации пользователя в контракте

 3. `value` | Number | optional
Количество пересылаемых ETH. Измеряется в ETH wei

 4. `gas` | Number | optional 
Рекомендуемое количество газа. Измеряется в gas wei

 5. `mode` | String | optional
Possible values: eth, function, erc20

 - `eth` - пересылка ETH  (default)
 - `function` - вызов функции контракта
 - `erc20` - пересылка токенов, частный случай `contract`, предполагается что вызывается функция `transfer(address to, uint value)`

 6. `functionSignature` | String | optional
В случае если mode==”function”, это поле обязательно и содержит сигнатуру функции
Во всех остальных случаях наличие этого параметра должно вызывать ошибку
Предполагается, что приложение клиента распарсит эту строку и даст пользователю поля для ввода данных для каждого из параметров функции
Примеры для erc20:
`transfer(address to, uint value)`
`approve(address spender, uint value)`
`balanceOf(address to)`

 7. `functionArguments` | Object | optional

 Object map of all agrumets that must be forvided to a function stated in `functionSignature` parameter.

 8. `selector` | String | optional

 If you want the pugin to generate the canvas tag with QR code and place in into you page DOM, you need to provide the DOM element selector.


## Contact us

We will be glad to hear from you via [https://join.slack.com/jibrelnetwork/signup](slack.com/jibrelnetwork)

Follow us on Twitter: [https://twitter.com/JibrelNetwork](@JibrelNetwork).

If you have a proposal or a came across some problems running the plugin please [submit an issue](https://github.com/jibrelnetwork/ethereum-qr-code/issues).


Developed by Qubist Labs, 2017

## License 

[MIT](LICENSE.md)
