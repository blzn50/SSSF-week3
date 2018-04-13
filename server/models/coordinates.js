'use strict';
class Coordinates {
    constructor() {
        this.ExifImage = require('exif').ExifImage;
    }

    gpsToDecimal(gpsData, hem) {
        let d = parseFloat(gpsData[0]) + parseFloat(gpsData[1] / 60) +
            parseFloat(gpsData[2] / 3600);
        return (hem === 'S' || hem === 'W') ? d *= -1 : d;
    }

    getCoordinates(pathToImage) {
        return new Promise((resolve, reject) => {
            new this.ExifImage({image: pathToImage}, (error, exifData) => {
                if (error) {
                    reject('Error: ' + error.message);
                } else {
                    resolve({
                        lat: this.gpsToDecimal(exifData.gps.GPSLatitude,
                            exifData.gps.GPSLatitudeRef),
                        lng: this.gpsToDecimal(exifData.gps.GPSLongitude,
                            exifData.gps.GPSLongitudeRef),
                    });
                }
            });
        });
    };
}

module.exports = new Coordinates();
