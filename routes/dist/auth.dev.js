"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../controllers/auth'),
    register = _require.register,
    login = _require.login,
    forgotPassword = _require.forgotPassword,
    resetPassword = _require.resetPassword;

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);
module.exports = router;