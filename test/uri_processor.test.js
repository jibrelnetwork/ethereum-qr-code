import { encodeEthereumUri, decodeEthereumUri, validateEthereumUri } from '../src/uri_processor';


global.describe('URI for ETH send', () => {
  const getValidUriData = () =>
    // it is easier to use function than to make deep clone
    ({
      to: '0xf661e08b763d4906457d54c302669ec5e8a24e37',
      from: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
      value: '10000000',
      gas: 21000,
    })
  ;


  global.it('should accept valid URI', () => {
    global.expect(validateEthereumUri(getValidUriData())).toEqual(undefined);
  });

  global.it('should accept without optional args', () => {
    const testObj = getValidUriData();
    delete testObj.from;
    delete testObj.value;
    delete testObj.gas;
    global.expect(validateEthereumUri(testObj)).toEqual(undefined);
  });

  global.it('should not accept wrong "to" address', () => {
    let testObj = getValidUriData();
    testObj.to = 'f661e08b763d4906457d54c302669ec5e8a24e37';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '0xf661e08b763d4906457d54c302669ec5e8a24zzz';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '0xf661e08b763d4906457d54c302669ec5e8a24e3';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    delete testObj.to;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "from" address', () => {
    let testObj = getValidUriData();
    testObj.from = 'fbb1b73c4f0bda4f67dca266ce6ef42f520fbb98';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb9z';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb9';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong ETH "value"', () => {
    let testObj = getValidUriData();
    testObj.value = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = -1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = 'abc';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "gas"', () => {
    let testObj = getValidUriData();
    testObj.gas = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = -1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = 'abc';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "chainId"', () => {
    let testObj = getValidUriData();
    testObj.chainId = 0;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.chainId = -1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.chainId = '34';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

  });

  global.it('should not accept not allowed properties', () => {
    let testObj = getValidUriData();
    testObj.test1 = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.test2 = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });


  global.it('should handle big number correctly', () => {
    let testObj = getValidUriData();
    testObj.value = '1000000000000000000000';
    global.expect(validateEthereumUri(testObj)).toEqual(undefined);

    testObj = getValidUriData();
    testObj.value = '100000034000000505000000';
    global.expect(validateEthereumUri(testObj)).toEqual(undefined);
  });
});


global.describe('URI for invocation of a function', () => {
  const getValidUriData = () =>
    // it is easier to use function than to make deep clone
    ({
      to: '0xf661e08b763d4906457d54c302669ec5e8a24e37',
      from: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
      value: '0',
      gas: 100000,
      mode: 'contract_function',
      functionSignature: {
        name: 'transfer',
        payable: false,
        args: [
          {
            name: 'to',
            type: 'address',
          },
          {
            name: 'value',
            type: 'uint',
          },
        ],
      },
      argsDefaults: [
        {
          name: 'to',
          value: '0xtokensrecipient',
        },
        {
          name: 'value',
          value: 1000000000000000000,
        },
      ],
    })
  ;


  global.it('should accept valid URI', () => {
    global.expect(validateEthereumUri(getValidUriData())).toEqual(undefined);
  });

  global.it('should accept without optional args', () => {
    const testObj = getValidUriData();
    delete testObj.from;
    delete testObj.value;
    delete testObj.gas;
    delete testObj.functionSignature.args;
    delete testObj.argsDefaults;
    global.expect(validateEthereumUri(testObj)).toEqual(undefined);
  });

  global.it('should not accept wrong "to" address', () => {
    let testObj = getValidUriData();
    testObj.to = 'f661e08b763d4906457d54c302669ec5e8a24e37';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '0xf661e08b763d4906457d54c302669ec5e8a24zzz';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '0xf661e08b763d4906457d54c302669ec5e8a24e3';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    delete testObj.to;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "from" address', () => {
    let testObj = getValidUriData();
    testObj.from = 'fbb1b73c4f0bda4f67dca266ce6ef42f520fbb98';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb9z';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb9';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong ETH "value"', () => {
    let testObj = getValidUriData();
    testObj.value = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = -1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = 'abc';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "gas"', () => {
    let testObj = getValidUriData();
    testObj.gas = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = -1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = 'abc';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept not allowed properties', () => {
    let testObj = getValidUriData();
    testObj.test1 = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.test2 = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept with wrong mode', () => {
    let testObj = getValidUriData();
    testObj.mode = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.mode = true;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    delete testObj.mode;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong function name', () => {
    let testObj = getValidUriData();
    testObj.functionSignature.name = '.test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.functionSignature.name = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    delete testObj.functionSignature.name;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "payable" mark', () => {
    let testObj = getValidUriData();
    testObj.functionSignature.payable = '.test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.functionSignature.payable = 'yes';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.functionSignature.payable = 'no';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    delete testObj.functionSignature.payable;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "args" array', () => {
    let testObj = getValidUriData();
    testObj.functionSignature.args = 'test';
    delete testObj.argsDefaults;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.functionSignature.args = [{}];
    delete testObj.argsDefaults;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.functionSignature.args = [{ name: 'test' }];
    delete testObj.argsDefaults;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.functionSignature.args = [{ type: 'test' }];
    delete testObj.argsDefaults;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.functionSignature.args[0].name = '*^&^$';
    delete testObj.argsDefaults;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.functionSignature.args[0].type = '*^&^$';
    delete testObj.argsDefaults;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "argsDefaults" array', () => {
    let testObj = getValidUriData();
    testObj.argsDefaults = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{}];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{ name: 'to' }];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{ value: 'test' }];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults[0].name = '*^&^$';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults[0].value = '*^&^$';
    global.expect(validateEthereumUri(testObj)).toEqual(undefined); // should accept any value
  });
});


global.describe('URI for ERC20 Transfer', () => {
  const getValidUriData = () =>
    // it is easier to use function than to make deep clone
    ({
      to: '0xf661e08b763d4906457d54c302669ec5e8a24e37',
      from: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
      gas: 100000,
      mode: 'erc20__transfer',
      argsDefaults: [
        {
          name: 'to',
          value: '0xtokensrecipient',
        },
        {
          name: 'value',
          value: 1000000000000000000,
        },
      ],
    })
  ;


  global.it('should accept valid URI', () => {
    global.expect(validateEthereumUri(getValidUriData())).toEqual(undefined);
  });

  global.it('should accept without optional args', () => {
    const testObj = getValidUriData();
    delete testObj.from;
    delete testObj.value;
    delete testObj.gas;
    delete testObj.argsDefaults;
    global.expect(validateEthereumUri(testObj)).toEqual(undefined);
  });

  global.it('should not accept wrong "to" address', () => {
    let testObj = getValidUriData();
    testObj.to = 'f661e08b763d4906457d54c302669ec5e8a24e37';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '0xf661e08b763d4906457d54c302669ec5e8a24zzz';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '0xf661e08b763d4906457d54c302669ec5e8a24e3';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    delete testObj.to;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "from" address', () => {
    let testObj = getValidUriData();
    testObj.from = 'fbb1b73c4f0bda4f67dca266ce6ef42f520fbb98';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb9z';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb9';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong ETH "value"', () => {
    let testObj = getValidUriData();
    testObj.value = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = -1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = 'abc';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "gas"', () => {
    let testObj = getValidUriData();
    testObj.gas = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = -1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = 'abc';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept not allowed properties', () => {
    let testObj = getValidUriData();
    testObj.test1 = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.test2 = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept with wrong mode', () => {
    let testObj = getValidUriData();
    testObj.mode = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.mode = true;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    delete testObj.mode;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "argsDefaults" array', () => {
    let testObj = getValidUriData();
    testObj.argsDefaults = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{}];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{ name: 'to' }];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{ value: 'test' }];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults[0].name = '*^&^$';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults[0].value = '*^&^$';
    global.expect(validateEthereumUri(testObj)).toEqual(undefined); // should accept any value
  });
});


global.describe('URI for ERC20 Approve', () => {
  const getValidUriData = () =>
    // it is easier to use function than to make deep clone
    ({
      to: '0xf661e08b763d4906457d54c302669ec5e8a24e37',
      from: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
      gas: 100000,
      mode: 'erc20__approve',
      argsDefaults: [
        {
          name: 'spender',
          value: '0xtokensrecipient',
        },
        {
          name: 'value',
          value: 1000000000000000000,
        },
      ],
    })
  ;


  global.it('should accept valid URI', () => {
    global.expect(validateEthereumUri(getValidUriData())).toEqual(undefined);
  });

  global.it('should accept without optional args', () => {
    const testObj = getValidUriData();
    delete testObj.from;
    delete testObj.value;
    delete testObj.gas;
    delete testObj.argsDefaults;
    global.expect(validateEthereumUri(testObj)).toEqual(undefined);
  });

  global.it('should not accept wrong "to" address', () => {
    let testObj = getValidUriData();
    testObj.to = 'f661e08b763d4906457d54c302669ec5e8a24e37';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '0xf661e08b763d4906457d54c302669ec5e8a24zzz';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '0xf661e08b763d4906457d54c302669ec5e8a24e3';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    delete testObj.to;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "from" address', () => {
    let testObj = getValidUriData();
    testObj.from = 'fbb1b73c4f0bda4f67dca266ce6ef42f520fbb98';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb9z';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb9';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong ETH "value"', () => {
    let testObj = getValidUriData();
    testObj.value = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = -1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = 'abc';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "gas"', () => {
    let testObj = getValidUriData();
    testObj.gas = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = -1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = 'abc';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept not allowed properties', () => {
    let testObj = getValidUriData();
    testObj.test1 = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.test2 = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept with wrong mode', () => {
    let testObj = getValidUriData();
    testObj.mode = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.mode = true;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    delete testObj.mode;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "argsDefaults" array', () => {
    let testObj = getValidUriData();
    testObj.argsDefaults = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{}];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{ name: 'to' }];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{ value: 'test' }];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults[0].name = '*^&^$';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults[0].value = '*^&^$';
    global.expect(validateEthereumUri(testObj)).toEqual(undefined); // should accept any value
  });
});


global.describe('URI for ERC20 TransferFrom', () => {
  const getValidUriData = () =>
    // it is easier to use function than to make deep clone
    ({
      to: '0xf661e08b763d4906457d54c302669ec5e8a24e37',
      from: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
      gas: 100000,
      mode: 'erc20__transferFrom',
      argsDefaults: [
        {
          name: 'from',
          value: '0xaddress1',
        },
        {
          name: 'to',
          value: '0xaddress2',
        },
        {
          name: 'value',
          value: 1000000000000000000,
        },
      ],
    })
  ;


  global.it('should accept valid URI', () => {
    global.expect(validateEthereumUri(getValidUriData())).toEqual(undefined);
  });

  global.it('should accept without optional args', () => {
    const testObj = getValidUriData();
    delete testObj.from;
    delete testObj.value;
    delete testObj.gas;
    delete testObj.argsDefaults;
    global.expect(validateEthereumUri(testObj)).toEqual(undefined);
  });

  global.it('should not accept wrong "to" address', () => {
    let testObj = getValidUriData();
    testObj.to = 'f661e08b763d4906457d54c302669ec5e8a24e37';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '0xf661e08b763d4906457d54c302669ec5e8a24zzz';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '0xf661e08b763d4906457d54c302669ec5e8a24e3';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.to = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    delete testObj.to;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "from" address', () => {
    let testObj = getValidUriData();
    testObj.from = 'fbb1b73c4f0bda4f67dca266ce6ef42f520fbb98';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb9z';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb9';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.from = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong ETH "value"', () => {
    let testObj = getValidUriData();
    testObj.value = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = -1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = 'abc';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.value = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "gas"', () => {
    let testObj = getValidUriData();
    testObj.gas = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = -1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = 'abc';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.gas = '';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept not allowed properties', () => {
    let testObj = getValidUriData();
    testObj.test1 = 1.1;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.test2 = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept with wrong mode', () => {
    let testObj = getValidUriData();
    testObj.mode = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.mode = true;
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    delete testObj.mode;
    global.expect(() => validateEthereumUri(testObj)).toThrow();
  });

  global.it('should not accept wrong "argsDefaults" array', () => {
    let testObj = getValidUriData();
    testObj.argsDefaults = 'test';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{}];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{ name: 'to' }];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults = [{ value: 'test' }];
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults[0].name = '*^&^$';
    global.expect(() => validateEthereumUri(testObj)).toThrow();

    testObj = getValidUriData();
    testObj.argsDefaults[0].value = '*^&^$';
    global.expect(validateEthereumUri(testObj)).toEqual(undefined); // should accept any value
  });
});


global.describe('Encode URI for ETH send', () => {
  const getValidUriData = () =>
    // it is easier to use function than to make deep clone
    ({
      to: '0xf661e08b763d4906457d54c302669ec5e8a24e37',
      from: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
      value: '10000000',
      gas: 21000,
    })
  ;


  global.it('should encode valid data', () => {
    global.expect(encodeEthereumUri(getValidUriData()))
      .toEqual(
        'ethereum:0xf661e08b763d4906457d54c302669ec5e8a24e37?from=0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98?value=10000000?gas=21000');
  });

  global.it('should decode valid data', () => {
    const encodedData = encodeEthereumUri(getValidUriData());
    global.expect(decodeEthereumUri(encodedData)).toEqual(getValidUriData());
  });
});


global.describe('Encode URI for invocation of a function', () => {
  const getValidUriData = () =>
    // it is easier to use function than to make deep clone
    ({
      to: '0xf661e08b763d4906457d54c302669ec5e8a24e37',
      from: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
      value: '10000000',
      gas: 100000,
      mode: 'contract_function',
      functionSignature: {
        name: 'transfer',
        payable: false,
        args: [
          {
            name: 'to',
            type: 'address',
          },
          {
            name: 'value',
            type: 'uint',
          },
        ],
      },
      argsDefaults: [
        {
          name: 'to',
          value: '0xtokensrecipient',
        },
        {
          name: 'value',
          value: 1000000000000000000,
        },
      ],
    })
  ;

  global.it('should encode and decode valid data', () => {
    const encodedData = encodeEthereumUri(getValidUriData());
    global.expect(decodeEthereumUri(encodedData)).toEqual(getValidUriData());
  });
});


global.describe('Encode URI for ERC20 Transfer', () => {
  const getValidUriData = () =>
    // it is easier to use function than to make deep clone
    ({
      to: '0xf661e08b763d4906457d54c302669ec5e8a24e37',
      from: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
      gas: 100000,
      mode: 'erc20__transfer',
      argsDefaults: [
        {
          name: 'to',
          value: '0xtokensrecipient',
        },
        {
          name: 'value',
          value: 1000000000000000000,
        },
      ],
    })
  ;

  global.it('should encode and decode valid data', () => {
    const encodedData = encodeEthereumUri(getValidUriData());
    global.expect(decodeEthereumUri(encodedData)).toEqual(getValidUriData());
  });
});


global.describe('Encode URI for ERC20 Approve', () => {
  const getValidUriData = () =>
    // it is easier to use function than to make deep clone
    ({
      to: '0xf661e08b763d4906457d54c302669ec5e8a24e37',
      from: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
      gas: 100000,
      mode: 'erc20__approve',
      argsDefaults: [
        {
          name: 'spender',
          value: '0xtokensrecipient',
        },
        {
          name: 'value',
          value: 1000000000000000000,
        },
      ],
    })
  ;

  global.it('should encode and decode valid data', () => {
    const encodedData = encodeEthereumUri(getValidUriData());
    global.expect(decodeEthereumUri(encodedData)).toEqual(getValidUriData());
  });
});


global.describe('Encode URI for ERC20 TransferFrom', () => {
  const getValidUriData = () =>
    // it is easier to use function than to make deep clone
    ({
      to: '0xf661e08b763d4906457d54c302669ec5e8a24e37',
      from: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
      gas: 100000,
      mode: 'erc20__transferFrom',
      argsDefaults: [
        {
          name: 'from',
          value: '0xaddress1',
        },
        {
          name: 'to',
          value: '0xaddress2',
        },
        {
          name: 'value',
          value: 1000000000000000000,
        },
      ],
    })
  ;

  global.it('should encode and decode valid data', () => {
    const encodedData = encodeEthereumUri(getValidUriData());
    global.expect(decodeEthereumUri(encodedData)).toEqual(getValidUriData());
  });
});

