//Contains code for handling the REST API endpoints for /campsites and campsites/campsiteId/

const express = require('express');
const Campsite = require('../models/campsite');

const campsiteRouter = express.Router(); //call to the express.Router method with no arguments gives you a method we can use with express routing methods 

campsiteRouter.route('/')
    .get((req, res, next) => {
        Campsite.find()
        .then(campsites => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsites)
        })
        .catch(err => next(err));
    })

    .post((req, res, next) => {
        Campsite.create(req.body)
        .then(campsite => {
            console.log('Campsite Created ', campsite);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite);
        })
        .catch(err => next(err));
    })

    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /campsites');
    })

    .delete((req, res, next) => { //need to be careful with this method
        Campsite.deleteMany()
        .then(response =>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
    });

//app and routing ie app.all('/campsites) deleted because now they are all chained to the campsiteRouter as one

campsiteRouter.route('/:campsiteId')

    .get((req, res, next) => { //allows us to store whatever the client sends as part of the path after the slash as a route parameter named campsiteId
        Campsite.findById(req.params.campsiteId)
        .then(campsite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite);
        })
        .catch(err => next(err));
    })

    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /campsites/${req.params.campsiteId} `);
    })

    .put((req, res, next) => {
        Campsite.findByIdAndUpdate(req.params.campsiteId, {
            $set: req.body
        }, {new: true })
        .then(campsite => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(campsite);
        })
        .catch(err => next(err));
    })

    .delete((req, res, next) => {
        Campsite.findByIdAndDelete(req.params.campsiteId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
    });


module.exports = campsiteRouter; //now it can be used elsewhere 