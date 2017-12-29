import express from 'express';
import path from 'path';
import multer from 'multer';
import fs from 'fs';

import bcrypt from 'bcrypt-nodejs';

import config from '../common/config';


import Admin from '../models/Admin';

import adminAuth from '../middlewares/adminAuth';
import validation from '../middlewares/validation';
import multerUpload from '../middlewares/multerUpload';
import { deleteDoc } from '../middlewares/multerUpload';

const Models = config.default.models;

const route = express.Router();

const multerStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.stat(config.default.uploads.destination, (err, stats) => {
            if(err) {
                if(err.code === 'ENOENT') {
                    try {
                        fs.mkdirSync(config.default.uploads.destination);
                        cb(null, config.default.uploads.destination)
                    } catch(err) {
                        log.error(err.message);
                        res.status(500).json({ errors: err.message });
                    }
                };
            } else {
                cb(null, config.default.uploads.destination);
            }
        });
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const uploads = multer({
    storage: multerStorage,
    fileFilter: function(req, file, cb) {
        if(file.mimetype.split('/')[0] !== 'image') {
            cb(null, false)
        } else {
            cb(null, true)
        }
    },
    limits: {
        fileSize: 10**7
    }
});

route.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'adminPage.html')));

route.get('/new/:pass', (req, res) => {
    const { pass } = req.params;
    new Admin({ name: pass, hashPassword: bcrypt.hashSync(pass) }).save()
        .then(() => res.json('success'))
});

route.get('/*', adminAuth, (req, res) => res.sendFile(path.join(__dirname, '..', 'adminPage.html')));

route.post('/api/login', (req, res) => {
    const { isValid, errors } = validation(req.body);
    const { name, password } = req.body;

    if(!isValid) {
        res.status(400).json({ errors });
    } else {
        Admin.findOne({ name }, (err, user) => {
            if(err) {
                res.status(500).json({ errors: err.message });
            } else if(!user) {
                res.status(400).json({ errors: { name: 'No such user' } });
            } else {
                bcrypt.compare(password, user.hashPassword, (err, pas) => {
                    if(err) {
                        console.log(err)
                        res.status(400).json({ errors: err.message });
                    } else if(!pas) {
                        res.status(400).json({ errors: { password: 'Password not correct' } });
                    } else {
                        try {
                            req.session.isAdmin = true;
                            req.session.save();
                            res.json('login admin')
                        } catch(err) {
                            // log.error(err);
                            // res.status(500).json({ errors: err.message })
                        }
                    }
                });
            }
        });
    }
});

route.post('/fetch-categories', (req, res) => {
    res.json({ categories: Models.map(item => { return { title: item.title, name: item.name } }) })
});

route.post('/get-category', (req, res) => {
    const { value } = req.body;
    if(value === 'all') {
        Promise.all(Models.filter(item => item.title !== 'all').map(item => item.model.find({})))
            .then(reslv => {
                let products = [];
                reslv.forEach(prod => {
                    products.push(...prod);
                });
                res.json({ products })
            })
            .catch(err => console.log(err))
    } else {
        const productModel = Models.find(item => item.title === value);
        productModel.model.find({})
            .then(products => res.json({ products }))
            .catch(err => res.status(500).json({errors: err.message}))
    }
});

route.post('/edit-product', uploads.single('image'), multerUpload, (req, res) => {});

route.post('/delete-product', deleteDoc, (req, res) => {});


export default route;