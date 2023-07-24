const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;


// middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))
app.use(express.json())




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ys20m5d.mongodb.net/?retryWrites=true&w=majority`;  

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        client.connect();

        // database collections
        const colleges = client.db("collegeBooking").collection("colleges");
        const researchPapers = client.db("collegeBooking").collection("researchPapers");
        const users = client.db("collegeBooking").collection("users");


        //get all college
        app.get("/colleges", async (req, res) => {
            const result = await colleges.find().toArray();
            res.send(result);
        })


        app.get("/colleges/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            console.log(id) 
            const result = await colleges.find(query).toArray();
            res.send(result); 
        }) 
  

        app.post("/addUser", async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await users.insertOne(user);
            res.send(result);
        })

        app.get("/getUsers", async(req, res) => {
            const result = await users.find().toArray();
            res.send(result); 
        }) 

        app.patch("/review/:id", async(req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = {_id: new ObjectId(id)}
            const data = req.body
            const updaateObject = {
                $set: data,
            }
            const result = await users.updateOne(query, updaateObject)
            res.send(result)
        })


        // get user
        app.get("/mycollege/:email", async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { candidateEmail: email };
            console.log(query);
            const result = await users.find(query).toArray();
            res.send(result);
        }); 
        





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send("College Booking Service Server is Running...>>>>>")
})

app.listen(port, () => {
    console.log(`College Booking Service Server is Running on Port: ${port}`)
})