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

