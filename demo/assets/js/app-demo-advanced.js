let qr;

const updateQR = () => {

    //read the values from the form
    const to = $('#addess').val();
    const value = $('#amount').val();
    const gas = $('#gas').val();
    const size = $('#size').val();
    const functionSignature = $('#functionName').val();
    const functionArguments = $('#functionArguments').val();

    const mode= $('[name=mode]:checked').val()
    const toJSON= $('[name=toJSON]:checked').val()

    if (to && to.length) {

        //calll a plugin
        $('#resulting-string, #error-string').val('');
        $('#ethereum-qr-code').empty();
        qr.toCanvas({
            to,
            value,
            gas,
            size,
            selector: '#ethereum-qr-code',
            functionSignature,
            functionArguments,
            toJSON,
            mode
        })

        //set extra values, for demo purposes
        if(qr.result.status === 'success') $('#resulting-string').val(qr.result.value);
        if(qr.result.status === 'error') $('#error-string').val(qr.result.value);
    }   
}
const init = () => {
    //instantiate the plugin
    qr = new EtheriumQRplugin.etheriumQRplugin();

    //signup for input data update
    $('.qr-input').keyup(updateQR);
    $('.qr-input-on-change').change(updateQR);
}

$(document).ready(init);