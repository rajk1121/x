const mongoose = require('mongoose');
const validator = require('validator')
const DB = "mongodb+srv://rajk1121:Rajat1121@cluster0-chamy.mongodb.net/test?retryWrites=true&w=majority"
mongoose.connect(DB, {
    useNewUrlParser: true
}).then(conn => {
    // console.log(conn.connection);
    console.log('Connnected to DataBase');

});
const PlanSchema = new mongoose.Schema({
    ratingsAverage: {
        type: Number,
        validate: function (val) {
            if (val > this.totalRating) {
                throw new Error("ratingsAverage is greater than totalRatings")
            }
        }
    },
    totalRating: { type: Number },
    type: {
        type: String,
        validate: function abc(val) {
            var str = val.split(" ").join("");
            if (!validator.isAlpha(str)) {
                throw new Error("type contains numerics")
            }

        }
    },
    duration: { type: Number },
    name: {
        type: String, required: true,
        validate: function abc(val) {
            var str = val.split(" ").join("");
            if (!validator.isAlpha(str)) {
                throw new Error("name conatins other than alphabets")
            }

        }


    },
    price: { type: Number, required: true },
    description: { type: String, required: true, default: 'Cool Stuff' }
})
const PlanModels = mongoose.model('PlanModel', PlanSchema);
module.exports = PlanModels;