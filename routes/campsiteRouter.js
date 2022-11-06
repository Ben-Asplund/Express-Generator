//Contains code for handling the REST API endpoints for /campsites and campsites/campsiteId/

const express = require('express');
const campsiteRouter = express.Router(); //call to the express.Router method with no arguments gives you a method we can use with express routing methods 

campsiteRouter.route('/')
    .all((req, res, next) => {      //all is a routing method that's a catch all for all http verbs, req res next are the callback functions
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain'); //sending back plain text in the response body 
        next(); //next function passes control of the application routing to the next relevant routing method after this one otherwise it would just stop here
    })

    .get((req, res) => {
        res.end('Will send all the campsites to you'); //status code and headers are already set by app.all method
    })

    .post((req, res) => {
        res.end(`Will add the campsite: ${req.body.name} with description: ${req.body.description}`);
    })

    .put((req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /campsites');
    })

    .delete((req, res) => { //need to be careful with this method
        res.end('Deleting all campsites');
    });

//app and routing ie app.all('/campsites) deleted because now they are all chained to the campsiteRouter as one

campsiteRouter.route('/:campsiteId')

    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res) => { //allows us to store whatever the client sends as part of the path after the slash as a route parameter named campsiteId
        res.end(`Will send details of the campsite: ${req.params.campsiteId} to you`);
    })

    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /campsites/${req.params.campsiteId} `);
    })

    .put((req, res) => {
        res.write(`Updating the campsite: ${req.params.campsiteId}\n`);
        res.end(`Will update the campsite: ${req.body.name} 
        with description: ${req.body.description}`);
    })

    .delete((req, res) => {
        res.end(`Deleting campsite: ${req.params.campsiteId}`);
    });


module.exports = campsiteRouter; //now it can be used elsewhere 