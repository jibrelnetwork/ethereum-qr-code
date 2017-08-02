Based on https://github.com/ethereum/EIPs/issues/67

3 options os the string encoded possible:

```
ethereum:<address>[?value=<value>][?gas=<suggestedGas>][?function=nameOfFunction(param)]
```

## Getting started

Install from NPM: `npm install ethereum-qr-code --save`

Use in your code

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

### Parameters

`to` | String | required
The adress of the transaction

`from` | String | optional
Адрес откуда отправлять транзакцию. В случае контрактов это важно т.к. это единственный способ авторизации пользователя в контракте

`value` | Number | optional
Количество пересылаемых ETH. Измеряется в ETH wei

`gas` | Number | optional 
Рекомендуемое количество газа. Измеряется в gas wei

`mode` | String | optional
Possible values: eth, function, erc20

eth - пересылка ETH  (default)
function - вызов функции контракта
erc20 - пересылка токенов, частный случай `contract`, предполагается что вызывается функция `transfer(address to, uint value)`

`functionSignature` | String | optional
В случае если mode==”function”, это поле обязательно и содержит сигнатуру функции
Во всех остальных случаях наличие этого параметра должно вызывать ошибку
Предполагается, что приложение клиента распарсит эту строку и даст пользователю поля для ввода данных для каждого из параметров функции
Примеры для erc20:
`transfer(address to, uint value)`
`approve(address spender, uint value)`
`balanceOf(address to)`

`functionArguments` | Object | optional



## License 

MIT
