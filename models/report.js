//model for report when data is sent from form

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userID : {
        type: String,
        required: true,
    },
    marketID : {
        type: String,
        required: true,
    },
    marketName: {
        type: String,
        required: true,
    },
    cmdtyID : {
        type: String,
        required: true,
    },
    cmdtyName : {
        type: String,
        required: true,
    },
    priceUnit : {
        type: String,
        required: true,
    },
    convFctr : {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
})



module.exports = mongoose.model('reportDetails',reportSchema);