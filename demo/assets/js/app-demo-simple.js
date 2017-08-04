const init = () => {
    //instantiate the plugin
    const qr = new EtheriumQRplugin.etheriumQRplugin();

    //static config value
    const codeDetails = {
        to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
        value: 1,
        gas: 42,
        size:180,
        selector: '#ethereum-qr-code-simple',
        options: {
            margin: 2
        }
    };

    //run the plugin
    qr.toCanvas(codeDetails).then(function(result){
        document.getElementById('resulting-string').value = result.value;
    })
    
}

document.addEventListener("DOMContentLoaded", init);