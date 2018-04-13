'use strict';
class Resizer {
    constructor() {
        this.sharp = require('sharp');
    };

    resize(input, output, w, h) {
        return new Promise((resolve, reject) => {
            this.sharp(input).
                resize(w, h).
                toFile(output, (err, info) => {
                    if (err) {
                        reject(err);
                    }
                    if (info) {
                        resolve(info);
                    }
                });
        });
    }
}

module.exports = new Resizer();
