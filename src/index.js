import ReactDOM from 'react-dom';
import React, { PureComponent } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Row, Col } from 'react-bootstrap';

import './App.css';

class App extends PureComponent {
  state = {
    src: null,
    crop: {
      unit: '%',
      width: 30,
      aspect: 16 / 9
    }
  };

  onSegmentation = (e) => {

  }

  onRemoval = (e) => {

  }

  onCorrection = (e) => {

  }

  onClassification = (e) => {

  }

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            //reject(new Error('Canvas is empty'));
            console.error('Canvas is empty');
            return;
          }
          blob.name = fileName;
          window.URL.revokeObjectURL(this.fileUrl);
          this.fileUrl = window.URL.createObjectURL(blob);
          resolve(this.fileUrl);
        },
        'image/jpeg',
        1
      );
    });
  }

  render() {
    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div className="App">
        <Row>
          <input type="file" accept="image/*" onChange={this.onSelectFile} />
        </Row>
        <Row>
          <Col>
            {src && (
              <ReactCrop
                src={src}
                crop={crop}
                ruleOfThirds
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
              />
            )}</Col><Col>
            {croppedImageUrl && (
              <img alt="Crop" style={{ maxWidth: '100%' }} src={croppedImageUrl} />
            )}</Col>
        </Row>
        <Row>
          <button onClick={this.onRemoval}>BackGroundRemoval</button></Row>
        <Row>
          <button onClick={this.onSegmentation}>Segmentation</button></Row>
        <Row>
          <button onClick={this.onClassification}>Classification</button></Row>
        <Row>
          <button onClick={this.onCorrection}>Correction</button></Row>
        <Row>
          <img src="workplace.jpg" alt="Workplace" usemap="#workmap" width="400" height="379"/>
          <map name="workmap">
            <area shape="rect" coords="34,44,270,350" alt="Computer" href="computer.htm"/>
            <area shape="rect" coords="290,172,333,250" alt="Phone" href="phone.htm"/>
            <area shape="circle" coords="337,300,44" alt="Cup of coffee" href="coffee.htm"/>
          </map>
        </Row>
      </div>
            );
  }
}

            ReactDOM.render(<App />, document.getElementById('root'));
