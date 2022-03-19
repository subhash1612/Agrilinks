# Agrilinks

How to run the code:

```
//on local
git clone https://github.com/subhash1612/Agrilinks
cd Agrilinks
npm install
node index.js
```

Make sure all the dependencies in the package.json file and MongoDB is installed properly as the API uses MongoDB as the backend database

Open your local browser and verify the API is working by accessing:
```
http://localhost:3000/reports/new   //To create a new report and returns a response to the user
http://localhost:3000/reports?ReportID=aaaaaaa1121212 // To retrieve an aggreate report document
```

An error message is displayed in the console and a error response is also sent to the client's browser when an error occurs.
