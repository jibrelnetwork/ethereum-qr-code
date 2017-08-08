const util = require('../src/utils');


describe('the validateSignature method', () => {

    it('should not accept the wrong or missing `name` parameter', () => {
        expect(util.validateSignature({

        })).toEqual(false);
    });

    it('should not validate with uncorrect `args` parameter', () => {
        expect(util.validateSignature('fdsfdsf')).toEqual(false);
    });

});


xtest('the `eth` method should add value value if it`s present', () => {
    const ethCaseData = {
        to: '0x1234567890',
        gas: 1000
    };
    expect(util.default.eth(ethCaseData)).toEqual('ethereum:0x1234567890[?gas=10000]');
    expect(util.default.eth(Object.assign({}, ethCaseData, {
        value: 42
    }))).toEqual('ethereum:0x1234567890[?gas=10000][?value=42');
});

xtest('the `function` method should throw error with missing `to` parameter', () => {
    const functionCaseData = {
        to: '0x1234567890',
        gas: 1000
    };
    expect(util.default.function(functionCaseData)).toEqual('Koen van Gilst');
    expect(util.default.function(erc20CaseData)).toEqual('Koen van Gilst');
});

xtest('the `erc20` method should add contact value if it`s present', () => {
    const erc20CaseData = {
        to: '0x1234567890',
        gas: 1000
    };
    expect(util.default.erc20(erc20CaseData)).toEqual('Koen van Gilst');
    expect(util.default.erc20(Object.assign({}, erc20CaseData, {
        contact: 'transfer'
    }))).toEqual('Koen van Gilst');
});