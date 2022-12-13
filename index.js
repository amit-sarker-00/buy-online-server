const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qpavz6c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const itemsCollections = client.db("allitems").collection("items");
    const orderCollections = client.db("allitems").collection("order");
    app.get("/items", async (req, res) => {
      const query = {};
      const allitems = await itemsCollections.find(query).toArray();
      res.send(allitems);
    });

    app.post("/additem", async (req, res) => {
      const item = req.body;
      const result = await itemsCollections.insertOne(item);
      res.send(result);
    });
    app.get("/items/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await itemsCollections.find(query).toArray();
      res.send(user);
    });
    app.get("/item", async (req, res) => {
      const query = { status: "unsold" };
      const allitmes = await itemsCollections.find(query).toArray();
      res.send(allitmes);
    });
    // my order
    app.post("/myorder", async (req, res) => {
      const item = req.body;
      const result = await orderCollections.insertOne(item);
      res.send(result);
    });
    app.get("/myorder/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const product = await orderCollections.find(query).toArray();
      res.send(product);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Online Server is running");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
