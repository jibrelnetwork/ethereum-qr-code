const EthereumQRplugin = require('../src/ethereumQrPlugin').default;

let qr, invalidCodeDetails;

const validCodeDetails = {
    to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
    value: 150,
    gas: 4200,
    size: 180,
    selector: '#ethereum-qr-code-simple',
    options: {
        margin: 2
    }
};

describe('main public EthereumQRplugin class', () => {

    beforeEach(() => {
        qr = new EthereumQRplugin();
    });

    it('should generate simple encoded string with required addess', () => {

        const str = qr.toAdressString(validCodeDetails);
        expect(str).toBe('ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8[?gas=4200][?value=150]')
    });

       it('should generate JSON encoded string if `toJSON` it true', () => {

        const str = qr.toAdressString(Object.assign({}, validCodeDetails, {
            'toJSON': true
        }));
        
       expect(str).toBe("{\"to\":\"0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8\",\"gas\":4200,\"value\":150}")
    });

    it('should generate DataURI and return string', () => {

        return qr.toDataUrl(validCodeDetails).then((result) => {
            return expect(result.value).toBe("ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8[?gas=4200][?value=150]");
        })
    });


    it('should generate DataURI string with correct symbols', () => {

        return qr.toDataUrl(validCodeDetails).then((result) => {
            //take first N symbols
            return expect(result.dataURL.substr(0, 80)).toBe("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM0AAADNCAYAAAAbvPRpAAAAAklEQVR4Ae");
        })
    });

});
