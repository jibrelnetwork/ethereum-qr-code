$(document).ready(function(){
    
    const codeContainer = '#ethereum-qr-code';
    const qr = new EtheriumQRplugin.etheriumQRplugin(codeContainer);
    
    $('.qr-input').keyup(function(){

        const adress = $('#adress').val();
        const amount = $('#amount').val();
        const size = $('#size').val();
        
        $('#ethereum-qr-code').empty();
        qr.generate({
            tokenAdress: adress,
            tokenAmount: amount, 
            size: size
        })
    })
})