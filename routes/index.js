const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require("../config/auth.js");
const { db } = require('../models/user.js');

router.get('/', (req,res)=>{
    res.render('welcome');
})

//login page
router.get('/login', (req,res)=>{
    res.render('login');
})
//register page
router.get('/register', (req,res)=>{
    res.render('register');
})

router.get('/dashboard', ensureAuthenticated, (req,res)=>{
    res.render('dashboard',{
        user: req.user
    });
})

router.get('/editdash', ensureAuthenticated, (req,res)=>{
    res.render('editdash',{
        user: req.user
    });
    console.log("editdash");
})

module.exports = router; 