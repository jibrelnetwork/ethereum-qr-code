const EthereumQRplugin = require('../src/ethereumQrPlugin').default;

let qr;
let invalidCodeDetails;

const validCodeDetails = {
  to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  value: 15000000000000000000000,
  gas: 4200
};

const validConfigDetails = {
    size: 180,
    selector: '#ethereum-qr-code-simple',
    options: {
      margin: 2,
    },
  };

describe('main public EthereumQRplugin class', () => {
  beforeEach(() => {
    qr = new EthereumQRplugin();
  });

  it('should generate simple encoded string with required addess', () => {
    const str = qr.toAddressString(validCodeDetails);
    expect(str).toBe('ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?value=15000000000000000000000?gas=4200');
  });

  it('should generate DataURI and return string', () => qr.toDataUrl(validCodeDetails, validConfigDetails).then((result) => {
    return expect(result.value).toBe("ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?value=15000000000000000000000?gas=4200");
}));


  it('should generate DataURI string with correct symbols', () => qr.toDataUrl(validCodeDetails, validConfigDetails).then((result) => {
            //take first N symbols
            return expect(result.dataURL.substr(0, 80)).toBe("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM0AAADNCAYAAAAbvPRpAAAAAklEQVR4Ae");
        }));
});
