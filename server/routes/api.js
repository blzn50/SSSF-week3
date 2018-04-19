'use strict';
const express = require('express');
const router = express.Router();
const moment = require('moment');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const db = require('../models/database');
require('../config/passport')(passport);
const coords = require('../models/coordinates');
const resizer = require('../models/resizer');
const mongoose = require('mongoose');
const User = mongoose.model('User');
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

const getToken = (headers) => {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

// routes
router.post('/signup', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.json({ success: false, msg: 'Please pass username and password' });
    } else {
        let user = new User({
            username: req.body.username,
            password: req.body.password,
        });
        user.save((err) => {
            if (err) {
                console.log(err);
                return res.json({ success: false, msg: 'Username already exists' })
            }
            res.json({ success: true, msg: 'Successfully created user' });
        });
    }
});

router.post('/login', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            user.comparePassword(req.body.password, (err, isMatch) => {
                if (isMatch && !err) {
                    user.password = '';
                    const token = jwt.sign(user.toJSON(), process.env.JWT);
                    // return the information including token as JSON
                    res.json({ success: true, token: 'JWT ' + token });
                    // return;
                } else {
                    res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
                }
            });
        }
    });
});

router.get('/cats', passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    if (token) {
        Cat.find({user: req.user._id}).then((data) => {
            res.json(data);
        }).catch((err) => console.log(err));
    } else {
        res.sendStatus(403);
    }
});

// data upload to db
router.post('/upload', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            req.body['original'] = 'uploads/' + req.file.filename;
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
}, (req, res) => {
    const token = getToken(req.headers);
    if (token) {
        req.body.user = req.user._id;
        Cat.create(req.body).then((post) => {
            console.log('cat uploaded');
            res.send('cat posted');
        });
    } else {
        return res.sendStatus(403);
    }
}
);

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    if (token) {
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
    } else {
        res.sendStatus(403);
    }
});

router.patch('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    if (token) {
        Cat.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true },
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
    } else {
        res.sendStatus(403);
    }
});

router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const token = getToken(req.headers);
    if (token) {
        Cat.findByIdAndRemove(req.params.id, req.body, (err, post) => {
            if (err) return res.json(err);

            filDel(post.thumbnail);
            filDel(post.original);
            filDel(post.image);
            res.json('cat deleted');
        });
    } else {
        res.sendStatus(403);
    }
});



module.exports = router;
