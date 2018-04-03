var express = require('express');
var router = express.Router();
var products = require('../models/products.model');
var user = require('../models/users.model');


function requireLogin(req, res, next) {         // check if user is loged in or not
    if (!req.user) {
        res.redirect("/login");
    } else {
        next();
    }
};


function ifLogedOut(req, res, next) {
    if (user) {
        req.session.reset();
        }
        else {
        next();
    }
};

router.get("/users/homepage", function (req, res) {
    res.render("users/homepage.jade");
});

router.get("/users/logout",ifLogedOut, function (req, res) {        
    res.render('/homepage.jade');
});

router.get("/users/cart", function (req, res) {        // go to cart only if loged in
    res.render("users/cart.jade");
});

router.get("/users/men_watches", function (req, res) {
    products.find({ "category" : "menWatches" }, function(err, docs){      // show only the category we filtered
        if(err) res.json(err);
        else res.render('users/men_watches', {products: docs});
    });
});

router.get("/users/men_bracelets", function (req, res) {
    products.find({ "category" : "menBracelets" }, function(err, docs){
        if(err) res.json(err);
        else res.render('users/men_bracelets.jade', {products: docs});
    });
});

router.get("/men_sunglasses", function (req, res) {
    products.find({ "category" : "menSunglasses" }, function(err, docs){
        if(err) res.json(err);
        else res.render('users/men_sunglasses.jade', {products: docs});
    });
});

router.get("/users/women_watches", function (req, res) {
    products.find({ "category" : "womenWatches" }, function(err, docs){
        if(err) res.json(err);
        else res.render('users/women_watches.jade', {products: docs});
    });
});

router.get("/users/women_bracelets", function (req, res) {
    products.find({ "category" : "womenBracelets" }, function(err, docs){
        if(err) res.json(err);
        else res.render('users/women_bracelets.jade', {products: docs});
    });
});

router.get("/users/women_sunglasses", function (req, res) {
    products.find({ "category" : "womenSunglasses" }, function(err, docs){
        if(err) res.json(err);
        else res.render('users/women_sunglasses.jade', {products: docs});
    });
});

module.exports = router;
