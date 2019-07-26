const express = require('express');
var user = require('../data/user.json');
const fs = require('fs');
var { getuser, getspecificuser, postuser, patchuser, deleteuser } = require('./../controller/userController.js')
let userRouter = express.Router();
userRouter.route('/')
    .get(getuser)
    .post(postuser);
userRouter.route('/:id')
    .get(getspecificuser)
    .patch(patchuser)
    .delete(deleteuser);
module.exports = userRouter;