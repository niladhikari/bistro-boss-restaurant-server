const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fcmyfrv.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    // db collection
    const menuCollection = client.db("bistroDb").collection("menu");
    const reviewsCollection = client.db("bistroDb").collection("reviews");
    const cartCollection = client.db("bistroDb").collection("carts");


    //cart collection

    app.get('/carts', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/carts',async(req,res)=>{
       const cartItem = req.body;
       const result = await cartCollection.insertOne(cartItem);
       res.send(result);
    })

    //get operation for the menu data pass the client side
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });

    //get operation for the reviews data pass the client side
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });



    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Bistro Boss Restaurant is running ....");
});

app.listen(port, () => {
  console.log(`Bistro Boss Restaurant Server is running on port ${port}`);
});
