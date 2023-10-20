const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5001;

// middleware 
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8urwnno.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const productCollection = client.db('productDB').collection('product');
        const brandsCollection = client.db('productDB').collection('brands');
        const cartCollection = client.db('productDB').collection('mycart');
        const userCollection = client.db('productDB').collection('user');

        // prduct related apis

        app.get('/product', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/mycart', async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/brands', async (req, res) => {
            const cursor = brandsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const quary = { _id: new ObjectId(id) };
            const result = await productCollection.findOne(quary);
            res.send(result);
        })

        app.get('/brands/:brandName', async (req, res) => {
            const brand = req.params.brand;
            // console.log(brand);
            const quary = { brand: new ObjectId(brand) };
            const result = await productCollection.findOne(quary);
            res.send(result);
        })

        app.post('/mycart', async (req, res) => {
            const addProduct = req.body;
            // console.log(addProduct);
            const result = await cartCollection.insertOne(addProduct)
            res.send(result)
        })

        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            // console.log(newProduct);
            const result = await productCollection.insertOne(newProduct)
            res.send(result)
        })

        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedProduct = req.body;
            const product = {
                $set: {
                    name: updatedProduct.name,
                    price: updatedProduct.price,
                    brand: updatedProduct.brand,
                    type: updatedProduct.type,
                    rating: updatedProduct.rating,
                    details: updatedProduct.details,
                    photo: updatedProduct.photo
                }
            }
            const result = await productCollection.updateOne(filter, product, options)
            res.send(result);
        })

        app.delete('/mycart/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const quary = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(quary);
            res.send(result);
        })

        // user related apis

        app.get('/user', async (req, res) => {
            const cursor = userCollection.find();
            const users = await cursor.toArray();
            res.send(users);
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            // console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("my DigitalDynamo server is running...");
});


app.listen(port, () => {
    console.log(`Simple Crud is Running on port ${port}`);
});

