'use strict';
const express = require('express');
const router = express.Router();
const moment = require('moment');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const db = require('../models/database');
const coords = require('../models/coordinates');
const resizer = require('../models/resizer');

// const baseURL = 'http://localhost:8000/';

const Cat = db.getSchema('Cat');

/* image storage */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + moment().format('YYYYMMDDHHmmss') + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
}).single('image');

// checking file type
const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Please upload image file only');
    }
};

// file delete
const filDel = (pathToFile) => {
    fs.unlink(pathToFile, (err) => {
        if (err) throw err;
        console.log('file deleted with path:' + pathToFile);
    });
};

// routes
router.get('/cats', (req, res) => {
    Cat.find().then((data) => {
        res.json(data);
    }).catch((err) => console.log(err));
});

// data upload to db
router.post('/upload', (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            console.log(req.file);
            req.body['original'] = 'uploads/'+req.file.filename;
            req.body['time'] = moment().format('YYYY-MM-DD HH:mm');
            // go to extract exif from image
            next();
        }
    });
}, (req, res, next) => {
    coords.getCoordinates(req.file.path).then((coord) => {
        req.body.coordinates = coord;
        console.log('exif done');
        // go to image resize thumbnail
        next();
    });
}, (req, res, next) => {
    const thumbPath = 'uploads/thumbnails/' + req.file.filename;
    resizer.resize(req.file.path, thumbPath, 320, 320).
        then((res) => {
            console.log('image to thumbnail');
            req.body.thumbnail = thumbPath;
            // go to image resize to normal
            next();
        });
}, (req, res, next) => {
    const medPath = 'uploads/image/' + req.file.filename;
    resizer.resize(req.file.path, medPath, 770, 720).
        then((data) => {
            console.log('normal sized');
            req.body.image = medPath;
            next();
        });
}
, (req, res) => {
    Cat.create(req.body).then((post) => {
        console.log('cat uploaded');
        res.send('cat posted');
    });
}
);

// upload to db
// router.use('/upload', (req, res) => {
//     Cat.create(req.body).then((post) => {
//         res.send(post);
//     });
// });


router.get('/:id', (req, res) => {
    Cat.findById(req.params.id, (err, cat) => {
        if (err) {
            console.log(err);
            res.json(err);
        } else {
            fs.createReadStream(path.resolve(cat.thumbnail)).pipe(res);
            fs.createReadStream(path.resolve(cat.image)).pipe(res);
            console.log('cat gotten');
            res.json(cat);
        }
    });
});

router.patch('/:id', (req, res) => {
    Cat.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true},
        (err, cat) => {
            if (err) {
                console.log(err);
                res.json(err);
            } else {
                console.log('cat updated in db');
                console.log(cat);
                res.json(cat);
            }
        });
});

router.delete('/:id', (req, res) => {

    Cat.findByIdAndRemove(req.params.id, req.body, (err, post) => {
        if (err) return res.json(err);

        filDel(post.thumbnail);
        filDel(post.original);
        filDel(post.image);
        res.json('cat deleted');
    });
});

module.exports = router;
