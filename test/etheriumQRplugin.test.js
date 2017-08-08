const EtheriumQRplugin = require('../src/schemaGenerator');

let qr, invalidCodeDetails;

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


xdescribe('main schemaGenerator class', () => {

    beforeEach(() => {
        qr = new EtheriumQRplugin();
    });


    it('should generate simple encoded string with required addess', () => {

        const str = qr.toAdressString(toAdressString);
        expect(str).toBe(true);
    });


    it('should generate canvas of a requested size', () => {
        qr.toCanvas(validCodeDetails).then((result) => {
            expect(true).toBe(true);
        })
    });

    it('should generate DataURI string with correct symbols', () => {

        qr.toDataUrl(validCodeDetails).then((result) => {
            expect(true).toBe(true);
        })
    });

});
