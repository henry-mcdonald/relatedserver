const mongoose = require('mongoose')

if(process.env.NODE_ENV === 'development') {

    const MONGO_URI=process.env.MONGO_URI || 'mongodb://localhost/related'
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    
    const db = mongoose.connection; 
    
    db.once('open', () =>{
        console.log(`Mongoose is running ${db.host}: ${db.port}`)
    })
    
    db.on('error', (err) =>{
        console.error(`Mongoose IS NOT connected\n ${err}`)
    })
} else {
    // mongoDB Atlas code here
    
    const MongoClient = require('mongodb').MongoClient;
    const uri = process.env.ATLAS_URI
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db("test").collection("devices");
        // perform actions on the collection object
        client.close();
});
    // connect to orm
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    
    const db = mongoose.connection; 
    
    db.once('open', () =>{
        console.log(`Mongoose is running ${db.host}: ${db.port}`)
    })
    
    db.on('error', (err) =>{
        console.error(`Mongoose IS NOT connected\n ${err}`)
    })
}
