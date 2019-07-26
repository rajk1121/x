var user = require('../data/user.json')
const getuser = function (req, res) {
    res.status(200).json(user);
    res.end();
}
const getspecificuser = function (req, res) {
    const id = req.params.id;
    var obj = user.find(el => el.id == id);
    if (obj !== undefined)
        res.status(200).json(obj);
    else {
        res.status(404).send("<html><body><h2>Not Found</h2></body><html")
    }
    res.end();
}
const postuser = function (req, res) {
    user.push(req.body);
    user[user.length - 1].id = user.length;
    var str = JSON.stringify(user);
    fs.writeFileSync('./user.json', str)
    res.status(200).json({ status: "Done" })
    res.end();
}
const patchuser = function (req, res) {
    const id = req.params.id;
    if (req.body.name && req.body.username) {
        var obj = user.find(el => {
            return el.id == id
        })
        // if (!obj) {
        for (var key in req.body) {
            obj[key] = req.body[key];
        }
        fs.writeFileSync('./user.json', JSON.stringify(user));
        res.status(201).json({ status: "Done" });
        // } 
        // else {
        //     res.status(404).json({ status: "Data Not Found" });
        // }
    }
    else {
        res.status(404).send("Cannot perform Update Operation");
    }

    res.end();
}
const deleteuser = function (req, res) {
    const ied = req.params.id - 1;
    var done = false;
    for (var i = 0; i < user.length; i++) {
        if (user[i].id == ied) {
            console.log("Hello")
            user.splice(ied, 1);
            done = true;
            continue;
        }
        if (done) {
            user[i]["id"] = user[i]["id"] - 1;
        }

    }

    if (done) {
        fs.writeFileSync('../data/user.json', JSON.stringify(user));
        res.status(200).json({ status: "Done" });
    } else {
        res.status(404).json({ status: "No such Data" });
    }

    res.end();
}

module.exports = { getuser, getspecificuser, postuser, patchuser, deleteuser };