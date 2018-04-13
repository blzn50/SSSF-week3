'use strict';
class Database {
  constructor() {
    this.mongoose = require('mongoose');
    // this.http = require('http');
    this.https = require('https');
    const fs = require('fs');
    const sslkey = fs.readFileSync('ssl-key.pem');
    const sslcert = fs.readFileSync('ssl-cert.pem');
    this.options = {
      key: sslkey,
      cert: sslcert,
    };
  };

  connect(url, app, port) {
    this.mongoose.connect(url).then(() => {
      console.log('Connected successfully.');
      // this.http.createServer(app).listen(port, () => console.log(`server running on port ${port}`));
      this.https.createServer(this.options, app).listen(port, () => console.log(`server running on port ${port}`));
    }, (err) => {
      console.log('Connection to db failed: ' + err);
    });
  }

  getSchema(name) {
    return this.mongoose.model(name);
  }
}

module.exports = new Database();
