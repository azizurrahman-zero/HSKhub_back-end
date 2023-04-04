const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// express middleware
app.use(cors());
app.use(bodyParser.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_UPass}@hskhub.fzvq9dl.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("HSKhub");
    const wordsCollection = database.collection("Words");

    app.get("/words", async (req, res) => {
      const query = {};
      const cursor = wordsCollection.find(query);
      const words = await cursor.toArray();
      res.send(words);
    });

    app.post("/add", async (req, res) => {
      const word = req.body;
      const result = await wordsCollection.insertOne(word);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Server!");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
