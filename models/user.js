const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
email :{
    type  : String,
    required : true
} ,
password :{
    type  : String,
    required : true
} ,
date :{
    type : Date,
    default : Date.now
},
name :{
    type : String,
},
purpose :{
    type : String,
},
course1 :{
    type : Array,
},
course2 :{
    type : String,
},
course3 :{
    type : String,
},
course4 :{
    type : String,
},
course5 :{
    type : String,
},
course6 :{
    type : String,
},
org1 :{
    type : Array,
},
org2 :{
    type : String,
},
org3 :{
    type : String,
},
org4 :{
    type : String,
},
});
const User= mongoose.model('User',UserSchema);

module.exports = User;