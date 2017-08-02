/**
 * Adding extra icon to the QR-code
 */
class DrawIcon {
 addIcon(overlay, dimentions, qrcodeWrapper, callback) {
        let canvas = document.createElement('canvas');
        this.context = canvas.getContext('2d');
        this.size = dimentions,
        this.qrcode = qrcodeWrapper.childNodes[0];
   
        document.body.appendChild(canvas);

        canvas.width = dimentions;
        canvas.height = dimentions;

        this.context.imageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;

        this.context.drawImage(this.qrcode, 0, 0, this.size, this.size);

        const image = new Image();
        image.src = overlay;
        image.onload = () => {
          let offsetX = (this.size - image.width) / 2;
          let offsetY = (this.size - image.height) / 2;
          this.context.drawImage(image, offsetX, offsetY, image.width, image.height);
          callback();
        }
    }
  
}

export default DrawIcon;