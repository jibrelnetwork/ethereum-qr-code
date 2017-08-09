const util = require('../src/utils');


describe('the validateSignature method', () => {

    it('should not accept the wrong or missing `name` parameter', () => {
        expect(util.validateSignature({

        })).toEqual(false);
        
         expect(util.validateSignature({
            'name': /da!!sdas/
        })).toEqual(false);
    });

    it('should not validate with uncorrect `args` parameter', () => {
        expect(util.validateSignature({
            'name': 'funcName',
            'args':[{
                'title': 45
            }]})).toEqual(false);
    });

    it('should not validate with uncorrect `args` parameter', () => {
        expect(util.validateSignature({
            'name': 'funcName',
            'args':[{
                'type': 'Int', // wrong type
                'name': 'moneyAmount'
            },
        {
                'type': 'address',
                'name': 'userAddress'
            }]})).toEqual(false);
    });

     it('should not validate with uncorrect `args` parameter', () => {
        expect(util.validateSignature({
            'name': 'funcName',
            'args':[{
                'type': 'string', // missing name
            },
        {
                'type': 'address',
                'name': 'userAddress'
            }]})).toEqual(false);
    });

});


test('the `eth` method should add value value if it`s present', () => {
    const ethCaseData = {
        to: '0x1234567890',
        gas: 10000
    };
    expect(util.default.eth(ethCaseData)).toEqual('ethereum:0x1234567890[?gas=10000]');
    expect(util.default.eth(Object.assign({}, ethCaseData, {
        value: 42
    }))).toEqual('ethereum:0x1234567890[?gas=10000][?value=42]');
});




test('the `function` method should add function signature', () => {
    const functionCaseData1 = {
        to: '0x1234567890',
        gas: 5600,
        functionSignature: {
            'payable': false,
            'name': 'myFunc',
            'args': [{
                'type': 'string',
                'name': 'userName'
            },
        {
                'type': 'address',
                'name': 'userAddress'
            }]
        }
    };

     const functionCaseData2 = {
        to: '0x1234567890',
        gas: 12300,
        functionSignature: {
            'payable': true,
            'name': 'myFunc',
            'args': [{
                'type': 'address',
                'name': 'userAddress'
            }]
        }
    };
    expect(util.default.function(functionCaseData1)).toEqual('ethereum:0x1234567890[?gas=5600][?function=myFunc(string userName,address userAddress)]');
    expect(util.default.function(functionCaseData2)).toEqual('ethereum:0x1234567890[?gas=12300][?function=myFunc payable(address userAddress)]');
});

test('the `erc20` method should add contact value if it`s present', () => {
    const erc20CaseData = {
        to: '0x1234567890',
        gas: 1000
    };
    expect(util.default.erc20(erc20CaseData)).toEqual('ethereum:0x1234567890[?gas=1000]');
    expect(util.default.erc20(Object.assign({}, erc20CaseData, {
        contract: 'transfer'
    }))).toEqual('ethereum:0x1234567890[?gas=1000][?contract=transfer]');
});