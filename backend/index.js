const express = require("express");
const mongoose = require("mongoose");
const app = express();
const passport = require('passport');
const session = require('express-session');
const cors = require('cors')
const AdminRouter = require('./src/routes/admin');
const UserRouter = require('./src/routes/user');
const DealerRouter = require('./src/routes/dealership');


//db connect
app.use(express.json());
const dbConnection = async () => {
    try {
        await mongoose.connect("mongodb+srv://manishankarkumar789:mani789@cluster0.6apcgn9.mongodb.net/?retryWrites=true&w=majority");
        console.log("db connected!");
    } catch (error) {
        console.log(error);
    }
}

dbConnection();
app.use(cors());
app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:"SECRET"
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(AdminRouter)
app.use(UserRouter)
app.use(DealerRouter)
passport.serializeUser(function(user,cb){
    cb(null,user);
})
passport.deserializeUser(function(obj,cb){
    cb(null,obj);
})
app.listen(3000,()=>{
console.log("server started..");
});