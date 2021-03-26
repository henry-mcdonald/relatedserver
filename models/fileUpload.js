const mongoose =  require('mongoose')


const imageSchema = new mongoose.Schema({
    image: {
        type: String, require: true
    }
},
{timestamps:true})

const imageUpload = mongoose.model('imageUpload', imageSchema)

module.exports = imageUpload