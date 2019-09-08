const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userModel = require('../model/userModel');
const sendEmail = require('../utility/email');
const signIn = async (req, res) => {
    try {
        var data = req.body;
        if (!data.email || !data.password) {

            res.end('Information Not Available');
        }
        console.log("hello")
        var dbdata = await userModel.findOne({
            email: data.email
        });

        console.log("hello")
        if (!dbdata) {
            res.send('pwnwvpwvw')
            res.end("User Not Found");
        }

        console.log("hello")
        var ans = await bcrypt.compare(data.password, dbdata.password);
        if (!ans) {
            res.end("Password Incorrect");
        }
        console.log("hello")
        var token = jsonwebtoken.sign({ id: dbdata._id }, "Secret Key", { expiresIn: "1h" });

        console.log("hello")
        res.cookie("jwt", token, { "httpOnly": true }, { expires: new Date(Date.now()) });

        res.status(201).json({
            status: "Logged In",
            token
        })
    }
    catch (err) {
        // console.log(err)
        res.status(404).json({
            err: err
        })
    }


}
const signUp = async (req, res) => {
    try {
        var data = req.body;
        console.log(data)
        if (!data.email || !data.password) {
            res.send("Invalid Credentials")
        }
        var result = await userModel.create(data);
        var token = jsonwebtoken.sign({ id: result._id }, "Secret Key", { expiresIn: "1d" });
        res.cookie("jwt", token, { "httpOnly": true })
        let url = "https://google.com"
        await new sendEmail(result, url).sendWelcome();
        res.status(201).json({
            status: "Registration Successfull",
            token
        })

    }
    catch (err) {
        res.send(err)
    }
}
const isLogged = async (req, res, next) => {
    try {
        console.log("islogged")
        if (req.cookies.jwt) {
            let token = req.cookies.jwt;
            console.log(token)
            const obj = await jsonwebtoken.verify(token, "Secret Key");
            console.log(obj);
            let user = await userModel.findById(obj.id);
            res.locals.users = user;
            console.log(user)
            next();
        }
        else {
            next();
        }
    }
    catch{
        console.log('islogged')
        next();
    }

}
const protectRoute = async (req, res, next) => {

    try {
        //  console.log(token)
        var token = req.cookies.jwt;
        console.log("auth******");
        console.log(req.cookies);
        console.log("auth*****")

        if (token == 'logout' || !token) {
            // res.send('Not logged In')
            next();
            console.log('tokens')
        } else {
            console.log('******')
            var decoded = jsonwebtoken.verify(token, "Secret Key");
            if (!decoded) {
                res.send("token doesn't exist");

            }
            // console.log(decoded)

            var dbdata = await userModel.findById(decoded.id);
            console.log(dbdata)
            if (!dbdata) {
                res.end("User doesn't exist");
            }
            req.headers.user = dbdata;
            req.headers.roles = dbdata.roles;
            console.log(dbdata)
            console.log(req.headers.roles)
            next();
        }

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
        if (arg.includes(req.headers.roles)) {
            next();
        }
        else {
            res.status(404).json({
                status: "Not permitted",

            })
        }
    }
}
const forgotPassword = async (req, res) => {
    const email = req.body.email;

    // res.cookie('email', email, { "httpOnly": true }, { expires: new Date(Date.now()) + 20000 });
    console.log(req.body)
    console.log('aiwwfow')
    console.log(email)
    var dbdata = await userModel.findOne({ 'email': email });
    if (!dbdata) {
        res.status(404).json({
            status: "Not Found"
        })
    }
    else {
        console.log(dbdata)
        const token = dbdata.abc();
        const test = await userModel.updateOne({ email: email }, dbdata);
        res.status(201).send({ test });
        // let options = {
        //     recieeverId: dbdata.email,
        //     token: token,
        //     subject: "Token For You"
        // }
        let url = "http://localhost:3000/resetPassword?id=" + dbdata.email + "&token=" + token;
        console.log(url)
        // let url="https://google.com"
        // sendEmail(options);
        await new sendEmail(dbdata, url).sendForgot();
    }
}
const updatePassword = async (req, res) => {
    try {
        let user = req.headers.user;
        let dbPassword = user.password;
        let currPass = req.body.currPass;
        let newPass = req.body.newPass;
        let confirmPass = req.body.confirmPass;
        let ans = await bcrypt.compare(currPass, dbPassword);
        if (!ans) {
            res.status(404).send('Current Password does not match');
        }
        else {
            if (newPass != confirmPass) {
                res.status(404).send('New Password does not match');
            }
            else {
                user.password = newPass;
                user.confirmPassword = confirmPass;
                console.log(user)
                await user.save();
                console.log('After')
                res.send("Password Updated")
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}
const resetPassword = async (req, res) => {
    let token = req.query.token;
    let id = req.query.id;
    console.log('*******************')
    console.log(req.query)
    console.log('*******************')
    console.log(id);
    let dbdata = await userModel.findOne({ 'email': id });
    console.log(dbdata)
    if (!dbdata) {
        res.status(404).send("User Not Found")
    }
    else {
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        console.log(password);
        console.log(confirmPassword)
        if (password != confirmPassword) {
            res.status(404).send("Password Doesn't Match")
        }
        else {
            console.log(dbdata.resetToken);
            console.log(token)

            let hashToken = crypto.createHash('sha256').update(token).digest('hex');
            if (dbdata.resetToken != hashToken) {
                res.status(404).json("Token Invalid")
            }
            else {
                dbdata.password = password;
                dbdata.confirmPassword = confirmPassword;
                console.log("hello")

                console.log(dbdata)
                dbdata.resetToken = undefined;
                dbdata.ExpiresIn = undefined;
                console.log(dbdata)
                await dbdata.save()

                res.status(201).json({
                    status: "Done"
                })
            }

        }
    }
}
const protect = async (req, res, next) => {
    try {
        //  console.log(token)
        var token = req.cookies.jwt;
        console.log("auth******");
        console.log(req.cookies);
        console.log("auth*****")
        // var decoded = jsonwebtoken.verify(token, "Secret Key");
        // if (!decoded) {
        //     res.send("token doesn't exist");

        // }
        // console.log(decoded)

        // var dbdata = await userModel.findById(decoded.id);
        // console.log(dbdata)
        // if (!dbdata) {
        //     res.end("User doesn't exist");
        // }
        // req.user = dbdata;
        // req.headers.roles = dbdata.roles;
        // console.log(dbdata)
        // console.log(req.headers.roles)
        next();

    }
    catch (err) {
        res.status(404).json({
            status: "Authorization Failed",
            error: err
        })
    }

}

module.exports = { signIn, signUp, protect, protectRoute, isLogged, authorize, forgotPassword, resetPassword, updatePassword };