const init = () => {
    //instantiate the plugin
    const qr = new EtheriumQRplugin.etheriumQRplugin();

    //static config value
    const codeDetails = {
        to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
        value: 1,
        gas: 42,
        selector: '#ethereum-qr-code'
    };

    //run the plugin
    qr.toCanvas(codeDetails);
    if(qr.result.status === 'success') $('#resulting-string').val(qr.result.value);
}

$(document).ready(init);