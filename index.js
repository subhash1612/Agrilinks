const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Report = require('./models/report')
const aggregateReports  = require('./models/aggregateReport');
const bodyParser = require('body-parser')



mongoose.connect('mongodb://localhost:27017/Agrilinks', { useNewUrlParser: true, useUnifiedTopology: true }) //setting up MongoDB
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));                                             
app.use(bodyParser.json({ type: 'application/json'}));  


app.get('/reports/new',(req,res)=>{ //route to display form to user to add a new report
    res.render('new');
})

app.post('/reports',async (req,res)=>{
   
        try
        {
            const reports = await Report.find({cmdtyID:req.body.reportDetails.cmdtyID,marketID:req.body.reportDetails.marketID}) //find all matching reports with specified cmdtyID and marketID
            const aggreport = await aggregateReports.findOne({cmdtyID:req.body.reportDetails.cmdtyID,marketID:req.body.reportDetails.marketID}) //find any existing aggregate report with mentioned cmdtyID and marketID
            var newaggregateReport = {
                users :[],
                cmdtyName: 'a',
                cmdtyID:'a',
                price:0,
                marketID:'a',
                marketName:'a',
                priceUnit:'Kg',

            } //creating a dummy object to store results for aggregate Report

            if(aggreport) //If a matching aggregate report is found
            {
                newaggregateReport = aggreport; // make new report the aggregate report
                newaggregateReport.users = []; // make users list empty as users will be added again when we loop over the reports
            }
            if(reports && reports.length>0) //check if reports is not null and is not empty
            {
                var mean = 0; 
                var count = 0;
                    for(r of reports) //looping over all matching reports
                    {   
                            
                            var convPrice = r.price/r.convFctr; //converting
                            mean += convPrice;
                            count = count + 1;
                            newaggregateReport.users.push(r.userID); //pushing the userID to the user list of the aggregate report
                    }
                    //assigning values to the various properties of the aggregate report
                    newaggregateReport.cmdtyName = reports[0].cmdtyName;
                    newaggregateReport.price = mean/count;
                    newaggregateReport.cmdtyID = reports[0].cmdtyID;
                    newaggregateReport.marketID = reports[0].marketID;
                    newaggregateReport.marketName = reports[0].marketName;
                    newaggregateReport.priceUnit = "Kg";
                    newaggregateReport.price = mean/count;
                    newaggregateReport.users.push(req.body.reportDetails.userID);
                    const updateReport = await aggregateReports.findByIdAndUpdate(newaggregateReport._id,{...newaggregateReport},{new:true}); //update the aggregate report which is already present in the aggreagte report collection using the new data
                    await updateReport.save();
                    const newreports = new Report(req.body.reportDetails); //Make a new report and save in the reports collection
                    await newreports.save();  
                    const id = newaggregateReport._id;
                    res.json({status:"SUCCESS",ReportID:id}) //send a response to client 
                
            }
            else
            {   
                //If no matching documents found, create a new aggreagte report and a new report with the entered details
                newaggregateReport.users.push(req.body.reportDetails.userID);
                newaggregateReport.cmdtyName = req.body.reportDetails.cmdtyName;
                newaggregateReport.cmdtyID = req.body.reportDetails.cmdtyID;
                newaggregateReport.marketID = req.body.reportDetails.marketID;
                newaggregateReport.marketName = req.body.reportDetails.marketName;
                newaggregateReport.priceUnit = "Kg";
                newaggregateReport.price = req.body.reportDetails.price/req.body.reportDetails.convFctr;
                const newReport = new aggregateReports(newaggregateReport)
                await newReport.save();
                const newreports = new Report(req.body.reportDetails);
                await newreports.save();
                const id = newReport._id;
                res.json({status:"SUCCESS",ReportID:id}) // send a response to the client
            
            }
        }
        catch(err)
        {
            console.log(err)
            res.json({status:"FAILURE",ReportID:"undefined"}) // if error occurred send a message to the client
        }
    
  
})
app.get("/",(req,res)=>{
    res.send("Home Page")
})
app.get('/reports',async(req,res)=>{
    try
    {
        const id = req.query.ReportID; //get the id of the aggregate report document from query string
        const report = await aggregateReports.findById(id); //search in the aggregate report collection for matching document
        console.log(report) 
        res.send(report) //send the matched document to the client
    }
    catch(err)
    {
        console.log(err)
        await res.json({status:"FAILURE",ReportID:"undefined"}) //send error message to client if error occurred
    }
})
app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
})

module.exports = app; //exporting for testing api

