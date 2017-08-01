import DrawIcon from './tokenIcon';
import {tokenSchemaEIP67, tokenSchemaBitcoin} from './utils';
import QRCode from 'qrcodejs2';

class etheriumQRplugin {

    constructor(el){

        if(!el) {
            this.drawQrCodeContainer();
            return;
        }
        try {
            this.uiElement = document.querySelectorAll(el)[0];
        }
        catch(e){
            console.log('Error, QR code container not found');
        }
    }

    generate(config) {
        this.parseRequest(config);
        let generatedCode = this.schemaGenerator(this.tokenAdress, this.tokenName, this.tokenAmount);

        new QRCode(this.uiElement, {
            text: generatedCode,
            width: this.size,
            height: this.size
        });
      
        this.drawTokenIcon();
    }
    parseRequest(request){
        this.tokenName = request.tokenName;
        this.tokenAdress = request.tokenAdress;
        this.tokenAmount = request.tokenAmount;
        this.size = request.size || 128;
        this.imgUrl = request.imgUrl || false;
        this.schemaGenerator = request.schema === 'bitcoin' ? tokenSchemaBitcoin : tokenSchemaEIP67;
    }
    drawTokenIcon(){
        if (this.imgUrl) {
          const iconDraw = new DrawIcon();
          iconDraw.addIcon(this.imgUrl, this.size, this.uiElement, () => {
              this.uiElement.parentNode.removeChild(this.uiElement);
          });
        }
    }
    drawQrCodeContainer(){
        this.uiElement = document.createElement('div');
        document.body.appendChild(this.uiElement);
        this.uiElement.id = "qrcode-generation-container";
    }

}

export default etheriumQRplugin;