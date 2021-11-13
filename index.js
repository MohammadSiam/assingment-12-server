const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oktkt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     //client.close();
//     console.log("DataBase Connected Successfully");
// });
async function run() {
    try {
        await client.connect();
        console.log("database connected successfully");
        const database = client.db("CarrpiDb");
        const usersCollection = database.collection("users");
        const ordersCollection = database.collection("orders");
        const productCollection = database.collection("products");
        const exploreCollection = database.collection("explores");
        const ratingCollection = database.collection("rating");


        //get data indivudual email
        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = ordersCollection.find(query);
            const users = await cursor.toArray();
            res.json(users);
        })

        //Delete api For Orders
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const user = await ordersCollection.deleteOne(query);
            res.send(user)
        })
        //get data form collection for products in home page

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({})
            const product = await cursor.toArray();
            res.send(product)
        })

        //all orders api 
        app.get('/explore', async (req, res) => {
            const cursor = exploreCollection.find({})
            const product = await cursor.toArray();
            res.send(product)
        })

        //get api for explores collection
        app.get('/explores', async (req, res) => {
            const cursor = exploreCollection.find({})
            const product = await cursor.toArray();
            res.send(product)
        })

        //get Api for rating
        app.get('/rating', async (req, res) => {
            const cursor = ratingCollection.find({})
            const product = await cursor.toArray();
            res.send(product)
        })
        // create a document to insert
        app.post('/orders', async (req, res) => {
            const user = req.body;
            const result = await ordersCollection.insertOne(user);
            res.json(result)
        });

        app.post('/rating', async (req, res) => {
            const user = req.body;
            const result = await ratingCollection.insertOne(user);
            res.json(result)
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin })
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.json(result)

        })

        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

    } finally {

        // await client.close();

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello From Carrpi')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})