const SchemaGenerator = require('../src/schemaGenerator').default;

let sg, invalidCodeDetails;

const validCodeDetails = {
    to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
    value: 150,
    gas: 42,
    size: 180,
    selector: '#ethereum-qr-code-simple',
    options: {
        margin: 2
    }
};

describe('the SchemaGenerator class', () => {

    it('should throw error with missing `to` parameter', () => {

        invalidCodeDetails = Object.assign({}, validCodeDetails, {
            to: ''
        });

        function runWithIncorrectInput() {
            new SchemaGenerator(invalidCodeDetails)
        }

        expect(runWithIncorrectInput).toThrow();
    });

    it('should default to `eth` mode', () => {

        sg = new SchemaGenerator(validCodeDetails);
        expect(sg.mode).toBe('eth')
    });

    it('should throw error with incorrect adress in `to` parameter', () => {
        invalidCodeDetails = Object.assign({}, validCodeDetails, {
            to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A' //one '8' in the end is missing
        })

        function runWithIncorrectInput() {
            new SchemaGenerator(invalidCodeDetails)
        }

        expect(runWithIncorrectInput).toThrow();
    });

    it('should throw error with invalid `functionSignature` object in `function` mode', () => {
        
        invalidCodeDetails = Object.assign({}, validCodeDetails, {
            functionSignature: {
                'name': 'myFunction',
                //should be an Array
                'args' : { 
                    'foo': 'bar'
                }
            },
            mode: 'function'
        })


        function runWithIncorrectInput() {
            new SchemaGenerator(invalidCodeDetails)
        }

       expect(runWithIncorrectInput).toThrow();

    });

    it('should set mode to `eth` by default', () => {
        
        invalidCodeDetails = Object.assign({}, validCodeDetails, {
            mode: 'functional' //!! mind the 'al'
        })

        sg = new SchemaGenerator(invalidCodeDetails);
        expect(sg.mode).toBe('eth');

    });

    it('should throw error with invalid `functionSignature` object in `function` mode', () => {
        
        invalidCodeDetails = Object.assign({}, validCodeDetails, {
            functionSignature: {
                'name': 984534589
            },
            mode: 'function'
        });

        function runWithIncorrectInput() {
            new SchemaGenerator(invalidCodeDetails)
        }

       expect(runWithIncorrectInput).toThrow();

    });

      it('should throw error with invalid `from` field in `erc20` mode', () => {
        
        invalidCodeDetails = Object.assign({}, validCodeDetails, {
            from:  984534589,
            mode: 'erc20'
        });

        function runWithIncorrectInput() {
            new SchemaGenerator(invalidCodeDetails)
        }

       expect(runWithIncorrectInput).toThrow();

    });


});