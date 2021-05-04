const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var authenticate = require('../authenticate');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

const cors = require('./cors');

const distinct = (value, index, self) => 
    self.indexOf(value) === index;

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Favorites.findOne({ 'user': req.user })
    .populate('user')
    .populate('dishes')
    .then(
        (favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }, 
        err => next(err)
    )
    .catch(err => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Favorites.findOne({ 'user': req.user })
    .then(
        (favorites) => {
            
            if(!favorites) {

                let newFavorites = { user: req.user._id, dishes: req.body };

                Favorites
                .create(newFavorites)
                .then(favorites => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                },
                err => next(err))
                .catch(err => next(err))
            }
            else {

                req.body.forEach(elem => {

                    if(!favorites.dishes.find(x => x == elem._id)) 
                        favorites.dishes.push(elem._id);

                });

                favorites
                .save()
                .then(favorites => {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, err => next(err))
                .catch(err => next(err));
            }
        }, 
        err => next(err)
    )
    .catch(err => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Favorites.deleteOne({ 'user': req.user })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/' + req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Favorites.findOne({ 'user': req.user })
    .then(
        (favorites) => {
            
            if(!favorites) {

                let newFavorites = { user: req.user._id, dishes: [req.params.dishId] };

                Favorites
                .create(newFavorites)
                .then(favorites => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                },
                err => next(err))
                .catch(err => next(err))
            }
            else {

                if(!favorites.dishes.find(x => x == req.params.dishId)) 
                    favorites.dishes.push(req.params.dishId);

                favorites
                .save()
                .then(favorites => {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, err => next(err))
                .catch(err => next(err));
            }
        }, 
        err => next(err)
    )
    .catch(err => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/' + req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

    Favorites.findOne({ 'user': req.user })
    .then((favorites) => {

        favorites.dishes = favorites.dishes.filter(id => id != req.params.dishId);

        favorites
        .save()
        .then(favorites => {

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }, err => next(err))
        .catch(err => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));    
});

module.exports = favoriteRouter;