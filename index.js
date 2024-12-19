const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 9000;

// middlewires
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

const logger = (req, res, next) => {
  console.log("inside logger");
  next();
};
const verifyToken = (req, res, next) => {
  console.log("now inside the verifytoken", req.cookies);
  const token = req?.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    req.user = decoded;
    next();
  });
  // next();
};
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tkglq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // collection
    const jobCollection = client.db("jobsPortal").collection("jobs");
    const jobApplication_Collection = client
      .db("jobsPortal")
      .collection("application");

    // Auth releted apis
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false, //set ture when the url is https(in production)
      });
      res.send({ success: true });
    });
    //    job releted apis:
    app.get("/jobs", logger, async (req, res) => {
      console.log("now inside api callbacks");
      const email = req.query.email;
      let query = {};
      if (email) {
        query = { hr_email: email };
      }
      const cursor = jobCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //   details getting
    app.get("/job/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });
    // post job
    app.post("/job", async (req, res) => {
      const newJob = req.body;
      const result = await jobCollection.insertOne(newJob);
      res.send(result);
    });
    // job application creations
    app.post("/job-application", async (req, res) => {
      const application = req.body;
      const result = await jobApplication_Collection.insertOne(application);
      res.send(result);
    });
    //app.get('job-application/:job_id')==> geta specific job application by id
    app.get("/job-application/:job_id", async (req, res) => {
      const jobId = req.params.job_id;
      // console.log(jobId);
      const query = { job_id: jobId };
      const result = await jobApplication_Collection.find(query).toArray();
      res.send(result);
    });
    app.get("/job-application", verifyToken, async (req, res) => {
      const email = req.query.email;
      const query = { Applicant_email: email };
      if (req.user.email !== req.query.email) {
        return res.status(403).send({ message: "forbidded access" });
      }

      let result = {};
      if (email) {
        result = await jobApplication_Collection.find(query).toArray();
        console.log("cookies:", req.cookies);
      } else {
        result = await jobApplication_Collection.find().toArray();
      }
      // fokira way to aggrigate data
      for (const application of result) {
        // console.log(application.job_id);
        const query1 = { _id: new ObjectId(application.job_id) };
        const job = await jobCollection.findOne(query1);
        if (job) {
          application.title = job.title;
          application.company = job.company;
          application.company_logo = job.company_logo;
          application.location = job.location;
          application.category = job.category;
          application.status = job.status;
        }
      }
      res.send(result);
    });
    app.patch("/job-application/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: data.status,
        },
      };
      const result = await jobApplication_Collection.updateOne(
        filter,
        updatedDoc
      );
      res.send(result);
    });
    //     await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  const result = req.body;
  res.send("job is falling form sky");
});

app.listen(port, () => {
  console.log(`job is waiting at:${port}`);
});
