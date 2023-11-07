const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

 
 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hvzem5a.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const foodCollection = client.db('foodDB').collection('foods');


    app.get('/foods', async(req , res)=>{
       
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const results = await foodCollection.find(query).toArray();
      res.send(results)
     })

    app.get('/foods',async(req,res)=>{
     const cursor = foodCollection.find();
     const result = await cursor.toArray();
     res.send(result)
    })

    app.get('/foods/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await foodCollection.findOne(query);
      res.send(result)
    })

     
    


    app.post('/foods',async(req,res)=>{
        const food = req.body;
        const result = await foodCollection.insertOne(food);
        res.send(result)
    })


    app.delete('/foods/:id',async(req,res)=>{
      const id = req.params.id;
       
      const query = {_id: new ObjectId(id)};
      const result = await foodCollection.deleteOne(query);
      res.send(result)
    })
   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('This is my server site')
})

app.listen(port,()=>{
    console.log(`This port number is ${port}`);
})