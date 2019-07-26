var plans = require('../data/plan.json')
const deleteplan = function (req, res) {
    const ied = req.params.id - 1;
    var done = false;
    for (var i = 0; i < user.length; i++) {
        if (paln[i]["id"] === ied) {

            plans.splice(ied, 1);
            done = true;
        }
        if (done) {
            plans[i]["id"] = plans[i]["id"] - 1;
        }
    }
    if (done) {
        fs.writeFileSync('../data/plan.json', JSON.stringify(plan));
        res.status(200).json({ status: "Done" });
    } else {
        res.status(404).json({ status: "No such Data" });
    }

}
const patchplan = function (req, res) {
    const id = req.params.id;
    if (req.body.name && req.body.description) {
        var obj = plans.find(el => {
            return el.id == id
        })
        // if (!obj) {
        for (var key in req.body) {
            obj[key] = req.body[key];
        }

        res.status(201).json({ status: "Done" });
        fs.writeFileSync('./plan.json', JSON.stringify(plans));
        // }
        //  else {
        //     res.status(404).json({ status: "Data Not Found" })
        // }
    } else {
        res.status(404).send("Cannot perform Update Operation");

    }

    res.end();
}

const postplan = function (req, res) {
    plans.push(req.body);
    plans[plans.length - 1].id = plans.length;
    var str = JSON.stringify(plan);
    fs.writeFileSync('./plan.json', str)
    res.status(200).json({ status: "Done" })
    res.end();
}


const getplan = function (req, res) {
    res.status(200).json(plans);
    res.end();
}
const getspecificplan =
    function (req, res) {
        const id = req.params.id;
        var obj = user.find(el => el.id == id);
        if (obj !== undefined)
            res.status(200).json(obj);
        else {
            res.status(404).send("<html><body><h2>Not Found</h2></body><html")
        }
        res.end();
    }
module.exports = { getplan, getspecificplan, patchplan, deleteplan, postplan };