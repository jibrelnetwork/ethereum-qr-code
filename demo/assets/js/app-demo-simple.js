const init = () => {
    //instantiate the plugin
    const qr = new EtheriumQRplugin.etheriumQRplugin();

    //static config value
    const codeDetails = {
        to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
        value: 1,
        gas: 42,
        size:200,
        selector: '#ethereum-qr-code-simple',
        functionSignature: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
        functionArguments: '57435734657345634563475634856745683458346534',
        mode: 'function',
        options: {
            margin: 2
        }
    };

    //run the plugin
    qr.toCanvas(codeDetails).then(function(value){
        $('#resulting-string').val(value);
    })
    
}

$(document).ready(init);