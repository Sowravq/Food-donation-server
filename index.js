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
    const  requestCollection = client.db('requestDB').collection('requests');


     


     

    app.get('/foods', async(req , res)=>{
       
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const results = await foodCollection.find(query).toArray();
      res.send(results)
     })

     app.get('/foods/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await foodCollection.findOne(query);
      res.send(result)
    })

     app.get('/foods/:email',async(req,res)=>{
      const email = req.params.email;
       const query = {email:email};
       const result = await foodCollection.findOne(query);
       res.send(result)

     })

     

    app.get('/foods',async(req,res)=>{
     const cursor = foodCollection.find();
     const result = await cursor.toArray();
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


     
    app.get('/requests/:foodId',async(req,res)=>{
      const foodId = req.params.foodId;
      const query = {foodId:foodId};
      const resulted = await requestCollection.findOne(query);
      res.send(resulted)
    })

    app.get('/requests', async(req , res)=>{
       
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
      const results = await  requestCollection.find(query).toArray();
      res.send(results)
     })

     
    app.post('/requests',async(req,res)=>{
      const food = req.body;
      const result = await requestCollection.insertOne(food);
      res.send(result)
    })


    app.delete('/requests/:id',async(req,res)=>{
      const id = req.params.id;
       
      const query = {_id: new ObjectId(id)};
      const result = await requestCollection.deleteOne(query);
      res.send(result)
    })

    
    

    app.put('/foods/:id',async(req,res)=>{
      const  id =  req.params.id;
      const filter = {_id: new ObjectId(id)};
      // const filter = {email:email};
      console.log(filter);
      const option = {upsert:true};
      const information= req.body;
      console.log(information);
      const food ={
        $set: {
         name:information.name,
         email:information.email,
          donarImg:information.donarImg,
           foodName:information.foodName,
           photoUrl:information.photoUrl,
           foodQuantity:information.foodQuantity,
           location:information.location,
           expiredDate:information.expiredDate,
           foodStatus:information.foodStatus,
           additionalNotes:information.additionalNotes
      }
       
      }
      const result = await foodCollection.updateOne(  filter,food,option )
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