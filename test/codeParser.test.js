const readString = require('../src/codeParser').readString;

describe('string to object parser', () => {

    it('should return empty object if the address is not in ethereum: ns', () => {
        const val = 'bicoin:0x7cB57B5A97eAbe942__05C07890BE4c1aD3';
        expect(readString(val)).toBe(false);
    });

    it('should return `addres` if it\'s a valid eth adress', () => {
        const val = 'ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8[?gas=4200][?value=150]';
        expect(readString(val).to).toBe('0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8');
    });

    it('should return `gas` value if the input string contains it', () => {
        const val = 'ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8[?gas=4200][?value=150]';
        expect(readString(val).to).toBe('0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8');
        expect(readString(val).gas).toBe('4200');
    });

    it('should return `value` value if the input string contains it', () => {
        const val = 'ethereum:0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8[?gas=4200][?value=150]';
        expect(readString(val).value).toBe('150');
        expect(readString(val).gas).toBe('4200');
    });
});
