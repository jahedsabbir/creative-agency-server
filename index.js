const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3k5mk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const orderCollection = client.db("creativeAgency").collection("order");
  const feedbackCollection = client.db("creativeAgency").collection("feedback");
  const serviceCollection = client.db("creativeAgency").collection("service");
  const adminCollection = client.db("creativeAgency").collection("admin");
  app.post('/addOrder', (req, res) => {
      const order = req.body;
      console.log(order);
      orderCollection.insertOne(order)
      .then(result => {
          res.send(result.insertedCount > 0);
      })
  });

  app.get('/orders', (req, res) => {
      orderCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
  });

  app.post('/feedback', (req, res) => {
    const feedback = req.body;
    console.log(feedback);
    feedbackCollection.insertOne(feedback)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
});

app.get('/review', (req, res) => {
    feedbackCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
});

app.post('/addService', (req, res) => {
    const service = req.body;
    console.log(service);
    serviceCollection.insertOne(service)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
});

app.get('/service', (req, res) => {
    serviceCollection.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
});



app.post('/admin', (req, res) => {
    const admin = req.body;
    console.log(admin);
    adminCollection.insertOne(admin)
    .then(result => {
        res.send(result.insertedCount > 0);
    })
});

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        adminCollection.find({email: email})
        .toArray((err, admin) => {
            res.send(admin.length > 0)
        })
    })
});



app.get('/', (req, res) => {
    res.send('Hello World!')
  })



app.listen(process.env.PORT || port)