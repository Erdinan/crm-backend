var express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/login", (req, res, next) => {
  passport.authenticate("customer-login", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send(false);
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
      });
    }
  })(req, res, next);
});

router.post("/register", (req, res, next) => {
  passport.authenticate("customer-signup", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send(false);
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
      });
    }
  })(req, res, next);
});

router.post("/logout", function (req, res) {
  req.logout();
  req.session.destroy();
  res.send("succesfully logout");
});

module.exports = router;
