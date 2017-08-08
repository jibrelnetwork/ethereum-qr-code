const SchemaGenerator = require('../src/schemaGenerator').SchemaGenerator;

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


xdescribe('the SchemaGenerator class', () => {

    it('should throw error with missing `to` parameter', () => {
        sg = new SchemaGenerator();
        invalidCodeDetails = Object.assign({}, validCodeDetails, {
            to: ''
        })

    });

     it('should throw error with incorrect adress in `to` parameter', () => {
        sg = new SchemaGenerator();
        invalidCodeDetails = Object.assign({}, validCodeDetails, {
            to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A' //one '8' in the end is missing
        })

    });

    it('should throw error with invalid `functionSignature` object in `function` mode', () => {
        sg = new SchemaGenerator();
        invalidCodeDetails = Object.assign({}, validCodeDetails, {
            functionSignature: {
                'name': '!dfkjhf'
            }
        })

    });

    it('should throw error with invalid `functionSignature` object in `function` mode', () => {
        sg = new SchemaGenerator();
        invalidCodeDetails = Object.assign({}, validCodeDetails, {
            mode: 'ksdgf7834t3'
        })

    });

     it('should throw error with invalid `functionSignature` object in `function` mode', () => {
        sg = new SchemaGenerator();
        invalidCodeDetails = Object.assign({}, validCodeDetails, {
            functionSignature: {
                'name': '!dfkjhf'
            }
        })

    });


});