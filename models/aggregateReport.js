//Model for the aggregate report when matching reports are found

const mongoose = require('mongoose');

const aggregateSchema = new mongoose.Schema({
    
    cmdtyName : 
    {
        type: String,
        required: true,
    },
    cmdtyID : 
    {
        type : String,
        required: true,
    },
    marketID : 
    {
        type: String,
        required: true,
    },
    marketName: 
    {
        type : String,
        required: true,
    },
    users : 
    {
        type: [String],
        required: true,
    },
    priceUnit : 
    {
        type: String,
        required: true,
    },
    price: 
    {
        type: Number,
        required: true,
    },
    timestamp : 
    { 
        type : Date, 
        default: Date.now 
    }
})

module.exports  = mongoose.model('aggregateReports',aggregateSchema);

