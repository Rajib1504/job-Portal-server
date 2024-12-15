const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

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
    //     find the all data :
    app.get("/jobs", async (req, res) => {
      const cursor = jobCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //   details getting
    app.get("/job/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });
    // job application creations
    app.post("/job-application", async (req, res) => {
      const application = req.body;
      const result = await jobApplication_Collection.insertOne(application);
      res.send(result);
    });

    app.get("/job-application", async (req, res) => {
      const email = req.query.email;
      const query = { Applicant_email: email };
      const result = await jobApplication_Collection.find(query).toArray();
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
