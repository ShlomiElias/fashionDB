var express = require('express');
var router = express.Router();
var products = require('../models/products.model');
var user = require('../models/users.model');
var session = require("client-sessions");


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

router.get("/", function (req, res) {
    res.render("homepage.jade");
});

router.get("/homepage", function (req, res) {
    res.render("homepage.jade");
});

router.get("/sign-up", function (req, res) {
    res.render("sign-up.jade");
});

router.get("/login", function (req, res) {
    res.render("login.jade");
});

router.get("/cart", requireLogin, function (req, res) {        // go to cart only if loged in
    res.render("cart.jade");
});


router.get("/men_watches", function (req, res) {
    products.find({ "category" : "menWatches" }, function(err, docs){      // show only the category we filtered
        if(err) res.json(err);
        else res.render('men_watches', {products: docs});
    });
});

router.get("/men_bracelets", function (req, res) {
    products.find({ "category" : "menBracelets" }, function(err, docs){
        if(err) res.json(err);
        else res.render('men_bracelets.jade', {products: docs});
    });
});

router.get("/men_sunglasses", function (req, res) {
    products.find({ "category" : "menSunglasses" }, function(err, docs){
        if(err) res.json(err);
        else res.render('men_sunglasses.jade', {products: docs});
    });
});

router.get("/women_watches", function (req, res) {
    products.find({ "category" : "womenWatches" }, function(err, docs){
        if(err) res.json(err);
        else res.render('women_watches.jade', {products: docs});
    });
});

router.get("/women_bracelets", function (req, res) {
    products.find({ "category" : "womenBracelets" }, function(err, docs){
        if(err) res.json(err);
        else res.render('women_bracelets.jade', {products: docs});
    });
});

router.get("/women_sunglasses", function (req, res) {
    products.find({ "category" : "womenSunglasses" }, function(err, docs){
        if(err) res.json(err);
        else res.render('women_sunglasses.jade', {products: docs});
    });
});

//add session
router.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    saveUninitialized: false,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));

router.post("/login", function (req, res) {
    user.findOne({
        userName: req.body.userName,
        password: req.body.password
    }, function (err, user) {
        if (!user) {
            res.redirect("/login");
            console.log("wrong user name or password");
        } else {
            if (req.body.password, user.password) {
                req.session.user = user;
                res.redirect("users/homepage");
                console.log("hello " + req.body.userName + " you are now logged in");
            } else {
                res.redirect("/login");
                console.log("wrong user name or password");
            }
        }
    });
});

router.post("/sign-up", function (req, res) {
    var newuser = new user();
    newuser.firstName = req.body.userName;
    newuser.lastName = req.body.lastName;
    newuser.userName = req.body.userName;
    newuser.email = req.body.email;
    newuser.password = req.body.password;

    newuser.save(function (err, user) {
        if (err) {
            console.log("Error!");
            res.render("sign-up.jade");
        } else {
            res.redirect("/login");
        }
        console.log(newuser);
    });
});

module.exports = router;
