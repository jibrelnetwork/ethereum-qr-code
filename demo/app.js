$(document).ready(function(){
    
    const qr = new EtheriumQRplugin.etheriumQRplugin();
    
    $('.qr-input').keyup(function(){

        const adress = $('#addess').val();
        const amount = $('#amount').val();
        const size = $('#size').val();
        
        if(adress && adress.length) {
        $('#ethereum-qr-code').empty();
            qr.toCanvas({
                to: adress,
                value: amount, 
                size: size,
                selector: '#ethereum-qr-code',
            })
            console.log(qr._resultString);
        }
    })
})

/**
 *    qr.toDataUrl({
                to: adress,
                value: amount, 
                size: size,
            }).then(function(a){
                console.log(a);
            })
 */