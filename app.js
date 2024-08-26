const mongoose = require("mongoose");
const express = require("express");
const hbs = require('hbs');
const path = require('path');
const bodyParser = require("body-parser");

const ContactModel = require('./models/contact');
const app = express();

const PORT = 3000;

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

