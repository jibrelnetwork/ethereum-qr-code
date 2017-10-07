const EthereumQRPlugin = require('../index');

let qr;
let invalidCodeDetails;

const validCodeDetails = {
  to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
  value: 15000000000000000000000,
  gas: 4200,
};

const validConfigDetails = {
    size: 180,
    selector: '#ethereum-qr-code-simple',
    options: {
      margin: 2,
    },
  };

  global.describe('main public EthereumQRPlugin class', () => {
  beforeEach(() => {
    qr = new EthereumQRPlugin();
  });

  global.it('should generate simple encoded string with required addess', () => {
    const str = qr.toAddressString(validCodeDetails);
    expect(str).toBe('ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?value=15000000000000000000000?gas=4200');
  });

  global.it('should generate simple encoded string with allowed params', () => {
    
    const str = qr.toAddressString(Object.assign({}, validCodeDetails, {
      chainId: 34
    }));
    expect(str).toBe('ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?value=15000000000000000000000?gas=4200?chainId=34');
  });

  global.it('should generate DataURI and return string', () => {
    return qr.toDataUrl(validCodeDetails, validConfigDetails).then((result) => {
      return expect(result.value).toBe("ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?value=15000000000000000000000?gas=4200");
  })
});

global.it('should generate DataURI string with correct symbols', () => qr.toDataUrl(validCodeDetails, validConfigDetails).then((result) => {
    //lets' take first N symbols from the base64 string
    return expect(result.dataURL.substr(0, 80)).toBe("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM0AAADNCAYAAAAbvPRpAAAAAklEQVR4Ae");
  }));

  global.it('should parse endcoded string to JSON', () => {

    const str = 'ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?value=15000000000000000000000?gas=4200000';
    const getValidJSONData = () => ({
      to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
      value: '15000000000000000000000',
      gas: 4200000
    });
    expect(qr.readStringToJSON(str)).toEqual(getValidJSONData());

    const str2 = 'ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?from=0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?value=36453764?gas=33000';
    const getValidJSONData2 = () => ({
      to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
      from : '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
      gas: 33000,
      value: '36453764'
    });
    expect(qr.readStringToJSON(str2)).toEqual(getValidJSONData2());

    const str3 = 'ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?from=0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?value=7800000';
    const getValidJSONData3 = () => ({
      to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
      from : '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
      value: '7800000'
    });
    expect(qr.readStringToJSON(str3)).toEqual(getValidJSONData3());

    const str4 = 'ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?value=1200000';
    const getValidJSONData4 = () => ({
      to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
      value: '1200000'
    });
    expect(qr.readStringToJSON(str4)).toEqual(getValidJSONData4());

    const str5 = 'ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8?value=1200000?chainId=34';
    const getValidJSONData5 = () => ({
      to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
      value: '1200000',
      chainId: 34
    });
    expect(qr.readStringToJSON(str5)).toEqual(getValidJSONData5());
  });
});
