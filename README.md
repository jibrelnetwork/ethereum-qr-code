https://github.com/ethereum/EIPs/issues/67


 ethereum:<address>[?value=<value>][?gas=<suggestedGas>][?function=nameOfFunction(param)]

## Getting started

Install from NPM: `npm install ethereum-qr-code --save`

Use in your code

```
import EtheriumQRplugin from 'ethereum-qr-code';

// later in code
const qr = new EtheriumQRplugin(codeContainer);
const qrCode = qr.generate(adres, gas, amount);

```

## Usage

### Parameters

`to` | String | required
The adress of the transaction


2) from
Опционально
string
Адрес откуда отправлять транзакцию. В случае контрактов это важно т.к. это единственный способ авторизации пользователя в контракте

3) value
Опционально
Int
Количество пересылаемых ETH. Измеряется в ETH wei

4) gas
Опционально
Int
Рекомендуемое количество газа. Измеряется в gas wei

5) mode
Опционально
string
Возможные опции: eth, function, erc20
Другие опции невозможны, расширение списка опций - только в рамках EIP67
Описание опций:
eth - пересылка ETH  (default)
function - вызов функции контракта
erc20 - пересылка токенов, частный случай `contract`, предполагается что вызывается функция `transfer(address to, uint value)`

6) functionSignature
string
В случае если mode==”function”, это поле обязательно и содержит сигнатуру функции
Во всех остальных случаях наличие этого параметра должно вызывать ошибку
Предполагается, что приложение клиента распарсит эту строку и даст пользователю поля для ввода данных для каждого из параметров функции
Примеры для erc20:
`transfer(address to, uint value)`
`approve(address spender, uint value)`
`balanceOf(address to)`

7) functionArguments
Опционально
object


## License 

MIT
