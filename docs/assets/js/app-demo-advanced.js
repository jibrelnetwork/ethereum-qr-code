/*  eslint no-undef: 0 */

let qr;
const updateQR = () => {
  let functionSignature;
  let argsDefaults;
  let config;

  // read the values of the form
  const to = $('#addess').val();
  const value = parseInt($('#amount').val(), 10) || undefined;
  const gas = parseInt($('#gas').val(), 10) || undefined;
  const size = $('#size').val();
  const from = $('#from').val() || undefined;
  const mode = $('[name=mode]:checked').val();
  const toJSON = $('[name=toJSON]:checked').val() === 'true';

  try {
    functionSignature = JSON.parse($('#functionSignature').val());
    argsDefaults = JSON.parse($('#argsDefaults').val());
  } catch (e) {
    // empty ot invalid JSON
  }

  // clear UI
  $('#resulting-string, #error-string').val('').text('');
  $('#ethereum-qr-code').empty();
  $('.type-dynamic').hide();
  $(`.type-${mode}`).show();


  if (mode === 'basic') {
    config = {
      to,
      value,
      gas,
      from,
    };
  }

  if (mode === 'erc20__transfer') {
    config = {
      to,
      gas,
      from,
      argsDefaults,
      mode,
    };
  }

  if (mode === 'contract_function') {
    config = {
      to,
      gas,
      from,
      functionSignature,
      mode,
    };
  }
  // call a plugin
  try {
    qr.toCanvas(config, {
      size,
      toJSON,
      selector: '#ethereum-qr-code',
    }).then((result) => {
      $('#resulting-string').val(result.value);
    });
  } catch (e) {
    $('#error-string').text(e);
  }
};
const init = () => {
  // instantiate the plugin
  qr = new EthereumQRPlugin();

  // signup for input data update
  $('.qr-input').keyup(updateQR);
  $('.qr-input-on-change').change(updateQR);
  updateQR();
};

$(document).ready(init);
