const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../model/userModel');
const signIn = async (req, res) => {
    try {
        var data = req.body;
        if (!data.email || !data.password) {

            res.end('Information Not Available');
        }
        var dbdata = await userModel.findOne({
            email: data.email
        });
        if (!dbdata) {
            res.end("User Not Found");
        }
        var ans = await bcrypt.compare(data.password, dbdata.password);
        if (!ans) {
            res.end("Password Incorrect");
        }
        var token = jsonwebtoken.sign({ id: dbdata._id }, "Secret Key", { expiresIn: "10d" });
        res.status(201).json({
            status: "Logged In",
            token
        })
    }
    catch (err) {
        // console.log(err)
    }


}
const signUp = async (req, res) => {
    try {
        var data = req.body;
        if (!data.email || !data.password) {
            res.send("Invalid Credentials")
        }
        var result = await userModel.create(data);
        var token = jsonwebtoken.sign({ id: result._id }, "Secret Key", { expiresIn: "1d" });

        res.status(201).json({
            status: "Logged In",
            token
        })
        res.send(201).json({
            status: "created",
            result: result
        })
    }
    catch (err) {
        res.end(err)
    }
}
const protectRoute = async (req, res, next) => {

    try {

        var token = req.headers.authorization.split(" ")[1];
        var decoded = jsonwebtoken.verify(token, "Secret Key");
        if (!decoded) {
            res.send("token doesn't exist");

        }

        var dbdata = userModel.findById(decoded._id);
        if (!dbdata) {
            res.end("User doesn't exist");
        }
        req.headers.role = dbdata.role;
        next();

    }
    catch (err) {
        res.status(404).json({
            status: "Authorization Failed",
            error: err
        })
    }

}
const authorize = (...arg) => {
    return (req, res, next) => {
        if (arg.includes(req.headers.role)) {
            next();
        }
        else {
            res.status(404).json({
                status: "Not permitted",

            })
        }
    }
}
module.exports = { signIn, signUp, protectRoute, authorize };