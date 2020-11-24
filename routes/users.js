const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');
const passport = require('passport');
const { db } = require('../models/user');
const axios = require('axios');

router.get('/delete', (req, res) => {
    db.collection('users').remove({email: req.user.email})
    .then(function(result) {
        res.render('login');
    });
})

router.get('/', (req,res) => {
    res.render('welcome');
})

//login handle
router.get('/login', (req,res) => {
    res.render('login');
})
router.get('/register', (req,res) => {
    res.render('register')
})

router.get('/search', (req,res) => {
    db.collection('users').find().toArray()
    .then(function(result) {
        console.log(result);
        res.render('search', {
            //user: req.user
            array: result,
            user: req.user
        });
    })  
})

router.post('/search', (req, res) => {
    const {c1, c2, c3, c4, c5, c6, o1, o2, o3, o4, p} = req.body;
    console.log(c1, c2, c3, c4, c5, c6, o1, o2, o3, o4, p);

    if ((c1 == undefined) && (c2 == undefined) && (c3 == undefined) && (c4 == undefined) && (c5 == undefined) && (c6 == undefined) && (o1 == undefined) && (o2 == undefined) && (o3 == undefined) && (o4 == undefined) && (p == undefined)) {
        db.collection('users').find().toArray()
        .then(function(result) {
            newArray = result.filter(function( obj ) {
                return obj.email !== req.user.email;
            });
            console.log(newArray);
            res.render('search', {
                array: newArray,
                user: req.user
            });
        })  
    }

    // only need to check vals that are defined
    let courseArr = []
    let orgArray = []
    if (c1 != undefined) {
        courseArr.push(req.user.course1[0])
    }
    if (c2 != undefined) {
        courseArr.push(req.user.course1[1])
    }
    if (c3 != undefined) {
        courseArr.push(req.user.course1[2])
    }
    if (c4 != undefined) {
        courseArr.push(req.user.course1[3])
    }
    if (c5 != undefined) {
        courseArr.push(req.user.course1[4])
    }
    if (c6 != undefined) {
        courseArr.push(req.user.course1[5])
    }
    if (o1 != undefined) {
        orgArray.push(req.user.org1[0])
    }
    if (o2 != undefined) {
        orgArray.push(req.user.org1[1])
    }
    if (o3 != undefined) {
        orgArray.push(req.user.org1[2])
    }
    if (o4 != undefined) {
        orgArray.push(req.user.org1[3])
    }
    
    console.log("classes: " + courseArr); 
    console.log("orgs: " + orgArray);

    if (p != undefined) {
        if ((courseArr.length != 0 ) && (orgArray.length != 0)) {
            db.collection('users').find({
                "course1": { $all: courseArr },
                "org1": { $all: orgArray },
                "purpose": new RegExp(p, 'i')
            } ).toArray()
            .then(function(result) {
                newArray = result.filter(function( obj ) {
                    return obj.email !== req.user.email;
                });
                console.log(newArray);
                res.render('search', {
                    array: newArray,
                    user: req.user
                });
            })
        } else if (courseArr.length != 0) {
            db.collection('users').find({
                "course1": { $all: courseArr },
                "purpose":  new RegExp(p, 'i')
            } ).toArray()
            .then(function(result) {
                newArray = result.filter(function( obj ) {
                    return obj.email !== req.user.email;
                });
                console.log(newArray);
                res.render('search', {
                    array: newArray,
                    user: req.user
                });
            })
        } else if (orgArray.length != 0) {
            db.collection('users').find({
                "org1": { $all: orgArray },
                "purpose":  new RegExp(p, 'i')
            } ).toArray()
            .then(function(result) {
                newArray = result.filter(function( obj ) {
                    return obj.email !== req.user.email;
                });
                console.log(newArray);
                res.render('search', {
                    array: newArray,
                    user: req.user
                });
            })
        } else {
            db.collection('users').find({
                "purpose":  new RegExp(p, 'i')
            } ).toArray()
            .then(function(result) {
                newArray = result.filter(function(obj) {
                    return obj.email !== req.user.email;
                });
                console.log(newArray);
                res.render('search', {
                    array: newArray,
                    user: req.user
                });
            })
        }
    } else {
        if ((courseArr.length != 0 ) && (orgArray.length != 0)) {
            db.collection('users').find({
                "course1": { $all: courseArr },
                "org1": { $all: orgArray }
            } ).toArray()
            .then(function(result) {
                newArray = result.filter(function( obj ) {
                    return obj.email !== req.user.email;
                });
                console.log(newArray);
                res.render('search', {
                    array: newArray,
                    user: req.user
                });
            })
        } else if (courseArr.length != 0) {
            db.collection('users').find({
                "course1": { $all: courseArr }
            } ).toArray()
            .then(function(result) {
                newArray = result.filter(function( obj ) {
                    return obj.email !== req.user.email;
                });
                console.log(newArray);
                res.render('search', {
                    array: newArray,
                    user: req.user
                });
            })
        //} else if (orgArray.length != 0) {
        } else {
            db.collection('users').find({
                "org1": { $all: orgArray }
            } ).toArray()
            .then(function(result) {
                newArray = result.filter(function( obj ) {
                    return obj.email !== req.user.email;
                });
                console.log(newArray);
                res.render('search', {
                    array: newArray,
                    user: req.user
                });
            })
        }
    }

})

router.get('/editdash', (req,res) => {
    res.render('editdash', {
        user: req.user
    });
    console.log(req.user.course1);
})

router.get('/dashboard', (req, res) => {
    res.render('dashboard',{
        user: req.user
    });
})

// save dashboard edits
router.post('/dashboard', (req, res) => {
    const {name, purpose, course1, course2, course3, course4, course5, course6, org1, org2, org3, org4} = req.body;
    console.log(name, purpose, course1, course2, course3, course4, course5, course6, org1, org2, org3, org4);
    
    let arr = [course1, course2, course3, course4, course5, course6];
    let orgs = [org1, org2, org3, org4];
    db.collection('users').update({email: req.user.email}, {$set: {name: name}});
    db.collection('users').update({email: req.user.email}, {$set: {purpose: purpose}});
    db.collection('users').update({email: req.user.email}, {$set: {course1: arr}});
    db.collection('users').update({email: req.user.email}, {$set: {org1: orgs}})
    .then(() => {
        res.redirect('/dashboard');
   })
});

//Register handle
router.post('/login',(req,res,next)=>{
passport.authenticate('local',{
    successRedirect : '/dashboard',
    failureRedirect: '/users/login',
    failureFlash : true
})(req,res,next)
});

//register post handle
router.post('/register',(req,res)=>{
    const {name,email, password, password2} = req.body;
    let errors = [];
    console.log(' Name ' + name + ' email :' + email+ ' pass:' + password);
    
    if(!name || !email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }
    
    // API CALL HAS BEEN REMOVED FROM REPO TO AVOID EXPOSING KEY
    
    if (!email.includes('@live.unc.edu') && !email.includes('@unc.edu') && !email.includes('@cs.unc.edu')) {
        errors.push({msg : "Please use your UNC email address"});
    }

    //check if match
    if(password !== password2) {
        errors.push({msg : "Passwords dont match"});
    }
    
    //check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'Password must be at least 6 characters'})
    }
    
    if(errors.length > 0 ) {
    res.render('register', {
        errors : errors,
        name : name,
        email : email,
        password : password,
        password2 : password2})
     } else {
        //validation passed
       User.findOne({email : email}).exec((err,user)=>{
        console.log(user);   
        if(user) {
            errors.push({msg: 'Email already registered'});
            res.render('register',{errors,name,email,password,password2})  
           } else {
            const newUser = new User({
                name : name,
                email : email,
                password : password
            });
    
            //hash password
            bcrypt.genSalt(10,(err,salt)=> 
            bcrypt.hash(newUser.password,salt,
                (err,hash)=> {
                    if(err) throw err;
                        //save pass to hash
                        newUser.password = hash;
                    //save user
                    newUser.save()
                    .then((value)=>{
                        console.log(value)
                        req.flash('success_msg','You have now registered!');
                        res.redirect('/users/login');
                    })
                    .catch(value=> console.log(value));
                      
                }));
             }
       })
    }
})


//logout
router.get('/logout',(req,res)=>{
req.logout();
//req.flash('success_msg','Now logged out');
res.redirect('/users/login'); 
})
module.exports  = router;
