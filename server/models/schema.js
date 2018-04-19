'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const catSchema = new Schema({
    time: String,
    category: String,
    title: String,
    details: String,
    coordinates: {
        lat: Number,
        lng: Number,
    },
    thumbnail: String,
    image: String,
    original: String,
    user: String,
});

module.exports = mongoose.model('Cat', catSchema);
