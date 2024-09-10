const mongoose = require("mongoose");
const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");

const ContactModel = require('./models/contact');
const { title } = require("process");
const app = express();

const PORT = 3000;

let callLogs = []; // In-memory call logs

//DB Connection
const dbHostUrl = 'mongodb://127.0.0.1:27017/phonebook_db';
mongoose.Promise = global.Promise;mongoose.connect(dbHostUrl, {
    useNewUrlParser: true
}).then(() => {
    console.log("Databse Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

//Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Home Page Route
app.get('/', async(req, res) => {
  const contacts = await ContactModel.find();
  res.render('home', {data:contacts, title: 'phonebook-app', message: ' Phonebook' });
});

// Route to handle a fake call
app.post('/call', (req, res) => {
  const { phoneNumber, contactName } = req.body;
  // Ensure both phoneNumber and contactName are being logged
  console.log(`Logging call: ${contactName} - ${phoneNumber}`);
  
  // Store the call with name and phone number
  const callRecord = { phoneNumber, contactName, timestamp: new Date() };
  callLogs.push(callRecord); // Save the call in the logs

  res.status(200).send('Call logged');
});

// Route to retrieve recent calls
app.get('/recent-calls', (req, res) => {
  // Return the sorted call logs with correct fields (phoneNumber and contactName)
  res.json(callLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
});


//Add Contact Page
app.get('/phonebook/add', (req, res) => {
  res.render('phonebookadd');
});

app.post('/phonebook/add', async (req, res)=>{
  const contact = new ContactModel({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone
  });

  await contact.save().then(data => {
    res.send({
        message:"Contact created successfully!!",
        user:data
    });
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while creating user",
          body: JSON.stringify(req.body) + ""
      });
  });

});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

