var express = require("express");
const router = express.Router();
var authController = require("../controllers/authController");
var contactController = require("../controllers/contactController");


router.get("/", (req, res) => contactController.getOneProfile(req, res));

router.post("/updatepassword", (req, res) =>
  authController.updatePassword(req, res)
);

module.exports = router;