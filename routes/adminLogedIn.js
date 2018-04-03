var express = require('express');
var router = express.Router();
var product = require('../models/products.model');
var user = require('../models/users.model');
var admin = require('../models/admin.model');

// require admin login
function requireLogin(req, res, next) { 
    if (!admin) {
        res.redirect("/admin-login");
    } else {
        next();
    }
};

// check if admin is loged
function ifLogedOut(req, res, next) {
    if (admin) {
        req.session.reset();
    } else {
        next();
    }
};

router.get("/admin-signup", function (req, res) {
    res.render("admin-signup.jade");
});

router.get("/admin-login", function (req, res) {
    res.render("admin-login.jade");
});

router.get("/admin-homepage", requireLogin, function (req, res) {
    res.render("admin/admin-homepage.jade");
});

router.get("/admin-products", requireLogin, function (req, res) {
    product.find({}, function(err, docs){
        if(err) res.json(err);
        else res.render("admin/admin-products.jade", {products: docs});
    });
});

router.get("/admin/admin-products", requireLogin, function (req, res) {
    product.find({}, function(err, docs){
        if(err) res.json(err);
        else res.render("admin/admin-products.jade", {products: docs});
    });
});

router.get("/admin-products-add", requireLogin, function (req, res) {
    product.find({}, function(err, docs){
        if(err) res.json(err);
        else res.render("admin/admin-products-add.jade", {products: docs});
    });
});

router.get("/admin-products-edit", requireLogin, function (req, res) {
    product.find({}, function(err, docs){
        if(err) res.json(err);
        else res.render("admin/admin-products-edit.jade", {products: docs});
    });
});

router.get("/admin-users", requireLogin, function (req, res) {
    user.find({}, function(err, docs){
        if(err) res.json(err);
        else res.render("admin/admin-users.jade", {users: docs});
    });
});

router.get("/admin-logout", ifLogedOut, function (req, res) {
    res.render("admin/admin-logout.jade");
});

// check if admin in the DB
router.post("/admin-login", function (req, res) {
    admin.findOne({
        adminName: req.body.adminName,
        adminPassword: req.body.adminPassword
    }, function (err, admin) {
        if (!admin) {
            res.redirect("/admin-login");
            console.log("wrong admin or password");
        } else {
            if (req.body.adminPassword, admin.adminPassword) {
                req.session.admin = admin;
                res.render("admin/admin-homepage.jade");
                console.log("hello " + req.body.adminName + " you are now logged in");
            } else {
                res.redirect("/admin-login");
                console.log("wrong user name or password");
            }
        }
    });
});

// insert admin user to the DB
router.post("/admin-signup", function (req, res) {
    var newadmin = new admin();
    newadmin.adminName = req.body.adminName;
    newadmin.adminPassword = req.body.adminPassword;

    newadmin.save(function (err, admin) {
        if (err) {
            console.log("Error!");
            res.render("admin/admin-signup.jade");
        } else {
            res.redirect("/admin-login");
        }
        console.log(newadmin);
    });
});

// add/edit/delete users in DB in admin panel
router.post("/admin-users", function (req, res, next) {
            var byEmail = {
                email: req.body.email
            };
            user.deleteOne(byEmail, function (err, obj) {
                if (err) throw err;
                console.log("one document deleted");
            });

            var newvalues = {
                $set: {
                    firstName : req.body.firstName,
                    lastName : req.body.lastName,
                    userName: req.body.userName,
                    email: req.body.email,
                    password: req.body.password
                }
            };

            user.updateOne(byEmail, newvalues, function (err, res) {
                if (err) throw err;
                console.log("one document updated");
            });

            var newUser = new user();
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.userName = req.body.userName;
            newUser.email = req.body.email;
            newUser.password = req.body.password;

            newUser.save(function (err, user) {
                if (err) {
                    // console.log(err);
                    if (err.code === 11000) {
                        // console.log(err);
                    }
                    res.redirect('/admin-users');
                } else {
                    //req.session.user = user;
                    res.redirect('/admin-users');
                }
                next();
            });
            console.log(newUser);
        });

        // add/edit/delete users in DB in admin panel
router.post("/admin-users", function (req, res, next) {
    var byEmail = {
        email: req.body.email
    };
    user.deleteOne(byEmail, function (err, obj) {
        if (err) throw err;
        console.log("one document deleted");
    });

    var newvalues = {
        $set: {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: req.body.password
        }
    };

    user.updateOne(byEmail, newvalues, function (err, res) {
        if (err) throw err;
        console.log("one document updated");
    });

    var newUser = new user();
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.userName = req.body.userName;
    newUser.email = req.body.email;
    newUser.password = req.body.password;

    newUser.save(function (err, user) {
        if (err) {
            // console.log(err);
            if (err.code === 11000) {
                // console.log(err);
            }
            res.redirect('/admin-users');
        } else {
            //req.session.user = user;
            res.redirect('/admin-users');
        }
        next();
    });
    console.log(newUser);
});

        // delete products in DB in admin panel
        router.post("/admin-products", function (req, res, next) {
            var byId = {
                _id: req.body.id
                };
                
                product.deleteOne(byId, function (err, obj) {
                if (err) throw err;
                console.log("1 document deleted");
                console.log(byId);
                next();
                });
                res.redirect('/admin-products');

                var newvalues = {
                    $set: {
                        category : req.body.category,
                        src : req.body.src,
                        name: req.body.name,
                        brand: req.body.brand,
                        price: req.body.price
                    }
                };
                
                product.updateOne(byId, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("one document updated");
                });
        });

        // add products in DB in admin panel
        router.post("/admin-products-add", function (req, res, next) {
            var newProduct = new product();
            newProduct.category = req.body.category;
            newProduct.src = req.body.src;
            newProduct.name = req.body.name;
            newProduct.brand = req.body.brand;
            newProduct.price = req.body.price;
        
            newProduct.save(function (err, product) {
                if (err) {
                    res.render('admin-products-add');
                } 
                next();
            });
            res.redirect('/admin-products-add');
            console.log(newProduct);
        });

        // edit products in DB in admin panel
        router.post("/admin-products-edit", function (req, res, next) {
            var byId = {
                _id: req.body.id
                };
                var newvalues = {
                    $set: {
                        category : req.body.category,
                        src : req.body.src,
                        name: req.body.name,
                        brand: req.body.brand,
                        price: req.body.price
                    }
                }

                product.updateOne(byId, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("one document updated");
                });
                res.redirect("/admin-products-edit");
        });

        module.exports = router;