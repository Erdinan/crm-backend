var express = require('express');
const { session } = require('passport');
const router = express.Router();
const passport = require('passport');
var authController = require('../controllers/authController');
var contactController = require('../controllers/contactController');



router.post("/login", (req, res, next) => {
	passport.authenticate("customer-login", (err, user, info) => {
	  if (err) throw err;
	  if (!user) res.send(false);
	  else {
		req.logIn(user, (err) => {
		  if (err) throw err;
		  res.send("Successfully Authenticated");
		  console.log(req.user);
		});
	  }
	})(req, res, next);
  });

  router.get('/profile', (req, res) => contactController.getOneProfile(req, res));

  router.post("/register", (req, res, next) => {
	passport.authenticate("customer-signup", (err, user, info) => {
	  if (err) throw err;
	  if (!user) res.send(false);
	  else {
		req.logIn(user, (err) => {
		  if (err) throw err;
		  res.send("Successfully Authenticated");
		  console.log(req.user);
		});
	  }
	})(req, res, next);
  });


router.post('/logout',function(req,res){
    console.log("logging out..")
    req.logout();
    req.session.destroy();
    // req.flash('');
    res.send('succesfully logout');
})

router.post('/profile/updatepassword', (req, res) => authController.updatePassword(req, res));

module.exports = router;