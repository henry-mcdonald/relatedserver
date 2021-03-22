const mongoose = require('mongoose')


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
