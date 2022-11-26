const express= require('express');
const Favorite = require('../models/favorites');
const authenticate = require('../authenticate');
const user = require('../models/user');
const cors = require('./cors');
const { createStrategy } = require('../models/favorites');
const { response } = require('express');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next ) => {
    Favorite.find({ user: req.user._id})
        .populate(user)
        .populate(campsites)
        .then(campsites => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsites)
        })
        .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Favorite.findOne({user:req.user._id})
    .then(favoriteDocument => {
        if(favoriteDocument) {
            res.statusCode = 200;
            req.body.forEach(campsite => {  
                if(!favoriteDocument.campsites.includes(campsite.id)){
                    favoriteDocument.campsites.push(campsite.id)
                } 
            });
            favoriteDocument.save()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
        } else {
            Favorite.create({user:req.user._id, campsites: req.body})
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response)
            })
        }
    })
    .catch(err => next(err));
})


.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,(req, res) =>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Favorite.findOneAndDelete(req.params.Favorite)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json')
        })
})


//Beginning of :campsiteId router
favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next ) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Favorite.findOne({user:req.user._id})
    .then(favoriteDocument => {
        if (favoriteDocument.campsite.includes(campsite.id)) {
            favoriteDocument.campsites.push(req.params.campsiteId)
            favoriteDocument.save()
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            })
        } else {
            Favorite.create({user:req.user._id, campsites: req.params.campsiteId})
            .then(response => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response)
            })
        }
    })
    .catch(err => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res) =>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorite');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Favorite.updateOne({user:req.user._id})
    .then(favoriteDocument =>{
        if(favoriteDocument) {
            if (favoriteDocument.campsites.indexOf(req.params.favoriteId) !== -1) {
                favoriteDocument.campsites.splice(favoriteDocument.campsites.indexOf(req.params.favoriteId), 1)
                .then(favoriteDocument =>{
                    favoriteDocument.save()
                    .then(response =>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(response)
                    })  
                }                     
            )} 
        } else {
            res.setHeader('Content-Type','text/plain');
            res.send('You do not have any favorites');

        }
    })
    .catch(err => next(err));
})


module.exports = favoriteRouter;