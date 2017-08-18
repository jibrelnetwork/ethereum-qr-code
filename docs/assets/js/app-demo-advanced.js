let qr;

const updateQR = () => {

    //read the values of the form
    const to = $('#addess').val();
    const value = $('#amount').val();
    const gas = $('#gas').val();
    const size = $('#size').val();
    const from = $('#from').val();
    const functionSignature = escape($('#functionSignature').val());

    const mode = $('[name=mode]:checked').val() 
    const toJSON = $('[name=toJSON]:checked').val() === 'true';

    
    //clear UI
    $('#resulting-string, #error-string').val('').text('');
    $('#ethereum-qr-code').empty();

    $('.type-dynamic').hide();
    $(`.type-${mode}`).show();

    //call a plugin
    try {
        qr.toCanvas({
            to,
            value,
            gas,
            from,
            size,
            functionSignature,
            toJSON,
            mode,
            selector: '#ethereum-qr-code'
        }).then(function (result) {
            $('#resulting-string').val(result.value);
        })
    } catch (e) {
        $('#error-string').text(e);
    }



}
const init = () => {
    //instantiate the plugin
    qr = new EthereumQRplugin.ethereumQRplugin();

    //signup for input data update
    $('.qr-input').keyup(updateQR);
    $('.qr-input-on-change').change(updateQR);
    updateQR();
}

$(document).ready(init);