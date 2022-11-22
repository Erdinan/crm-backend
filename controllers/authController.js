const User = require("../models/users");

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else {
    res.status(401);
    return res.send("not logged in");
  }
}

function updatePassword(req, res) {
  const { retypePassword, newPassword, oldPassword } = req.body;
  User.findOne({ email: req.session.email }, (err, result) => {
    if (err) {
      console.log("session error");
      res.status(404);
    } else if (result.validPassword(oldPassword)) {
      if (newPassword === retypePassword) {
        let password = result.generateHash(retypePassword);
        User.findOneAndUpdate(
          { email: req.session.email },
          { password: password },
          (err, result) => {
            if (err) {
              console.log("db error");
              res.status(404);
            } else {
              res.status(200);
              res.send("password changed succesfully");
            }
          }
        );
      } else {
        console.log("retype error");
        res.status(401);
        res.send("retype error");
      }
    } else {
      console.log("error");
      res.status(401);
      res.send("old password error");
    }
  });
}

module.exports = {
  checkAuthentication,
  updatePassword,
};
