const express = require('express');
var user = require('../data/user.json');
const fs = require('fs');
var { getuser, getspecificuser, postuser, patchuser, deleteuser } = require('./../controller/userController.js')
var { signIn, signUp, protectRoute, authorize } = require("../controller/authController");
let userRouter = express.Router();
// userRouter.param('id', checkID);
userRouter.route('/')
    .get(protectRoute, getuser)
    .post(protectRoute, authorize("restaurant-owner", "admin"), postuser);
userRouter.route("/signin")
    .post(signIn);
userRouter.route('/signup').post(signUp);
userRouter.route('/:id')
    .get(getspecificuser)
    .patch(protectRoute, authorize("restaurant-owner", "admin"), patchuser)
    .delete(protectRoute, authorize("restaurant-owner", "admin"), deleteuser);
module.exports = userRouter;