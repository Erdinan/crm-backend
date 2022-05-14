const User = require('../models/users');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;



passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(user, done){
    User.findById(user.id, function(err, user){
        done(err, user);
    }); 
});

passport.use('customer-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true },
    function(req, email, password, done){
        process.nextTick( function(){
            User.findOne({'email': email}, function(err, existingUser){
            if (err){
                console.log(err);
                return done(err);
            }
            if (existingUser){
                console.log("existing");
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            }
            else {
                var newUser = new User();
                console.log(email);
                console.log(password);
                newUser.email = email;
                newUser.password = newUser.generateHash(password);
                newUser.username = req.body.username;
                req.session.email = email;
                
                console.log(req.body.fullname);
                newUser.save(function(err, out){
                    req.session.userId = out.id;
                    if (err)
                        throw(err);
                    return done(null, newUser);
                });
            }
        });
    });
}));


passport.use('customer-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true },

    function(req, email, password, done){
        process.nextTick( async function(){
            console.log(email);
            console.log(password)
            await User.findOne({'email': email}, function(err, user){
            if (err){
                
                return done(err);
            }
            else{
                if (user == null){
                    return done(null, false, req.flash('loginMessage', 'password is NULL'));
                }
                
                if (password === null){
                    return done(null, false, req.flash('loginMessage', 'password is NULL'));
                }
                if (password == false){
                    return done(null, false, req.flash('loginMessage', 'password is NULL'));
                }
                if (password == ""){
                    return done(null, false, req.flash('loginMessage', 'password is NULL'));
                }
                if (user.validPassword(password)){
                    req.session.email = email;
                    console.log(user.id)
                    req.session.userId = user.id;
                    // console.log(req.session.userId)
                    return done(null, user, req.flash('loginMessage', 'Login succesful'));
                }
                else{
                    return done(null, false, req.flash('loginMessage', 'Wrong email or password!'));
                } 
            }
        });
    });
}));


module.exports = passport;