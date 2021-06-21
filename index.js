const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
// const fs = require("fs-extra");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static("services"));
app.use(fileUpload());

const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i4bni.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const jobsCollection = client.db("neoJobs").collection("jobs");
  const appliedJobsCollection = client.db("neoJobs").collection("appliedJobs");

  // const reviewsCollection = client.db("creativeAgency").collection("reviews");
  // const ordersCollection = client.db("creativeAgency").collection("orders");
  const employerCollection = client.db("neoJobs").collection("employers");

  app.post("/addJobs", (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const salary = req.body.salary;

    jobsCollection.insertOne({ name, description, salary }).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  //   app.post("/addReview", (req, res) => {
  //     const review = req.body;
  //     reviewsCollection.insertOne(review).then((result) => {
  //       res.send(result.insertedCount > 0);
  //     });
  //   });

  app.get("/jobs", (req, res) => {
    jobsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
      console.log(documents);
    });
  });

  app.get("/jobsPosted", (req, res) => {
    jobsCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  //   app.get("/allServicesOrdered", (req, res) => {
  //     ordersCollection.find({}).toArray((err, documents) => {
  //       res.send(documents);
  //     });
  //   });

  //   app.get("/reviews", (req, res) => {
  //     reviewsCollection.find({}).toArray((err, documents) => {
  //       res.send(documents);
  //     });
  //   });

  app.post("/applyJob", (req, res) => {
    const appliedJob = req.body;
    appliedJobsCollection.insertOne(appliedJob).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addEmployer", (req, res) => {
    const employer = req.body;
    employerCollection.insertOne(employer).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/isEmployer", (req, res) => {
    const email = req.body.email;
    employerCollection.find({ email: email }).toArray((err, employers) => {
      res.send(employers.length > 0);
    });
  });
});

app.get("/", (req, res) => {
  res.send("This Epic Shit is Really Working!");
});

app.listen(process.env.PORT || port);
