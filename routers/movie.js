var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');

module.exports = {

    getAll: function (req, res) {
        Movie.find({}).populate("actors").exec(function (err, movies) {
            if (err) return res.status(400).json(err);

            res.json(movies);
        });
    },


    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        });
    },


    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();

                res.json(movie);
            });
    },


    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            res.json(movie);
        });
    },

    deleteById: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        })
    },

    deleteActorFromMovie: function (req, res) {
        Actor.findOne({ _id: req.params.actorid }, function (err, actor) {
            if (err) return res.status(400).json(err);
            if (!actor) return res.status(404).json();

            Movie.findOneAndUpdate({ _id: req.params.movieid }, { $pull: {actors:req.params.actorid} }, function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            })
        })
    },

    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.movieid}, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            Actor.findOne({ _id: req.params.actorid }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status.json();

                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);

                    res.json(movie);
                })

            })
        })
    },

    getAllBetweenYear: function (req, res) {
        Movie.find({ year: { $lte: req.params.y1, $gte: req.params.y2 }}, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();

            res.json(movie);
        })
    },

    deleteAllBetweenYear: function (req, res) {
        Movie.deleteMany({ year: { $lte:req.body.y1, $gte:req.body.y2 }}, function (err, movie) {
            if (err) return res.status(400).json(err);

            res.json(movie);
        })
    }
};