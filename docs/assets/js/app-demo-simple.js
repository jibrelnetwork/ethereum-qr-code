const init = () => {

    // highlight code , for demo purposes only!
    highlightCodeBlocks();
    
    //instantiate the plugin
    const qr = new EthereumQRplugin.ethereumQRplugin();

    //static config value
    const codeDetails = {
        to: '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8',
        value: 1,
        gas: 42000,
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

var highlightCodeBlocks =  function(event) {Array.prototype.forEach.call(document.getElementsByClassName('javascript'), function(block) {window.hljs.highlightBlock(block);})};