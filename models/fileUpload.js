const mongoose =  require('mongoose')


const replySchema = new mongoose.Schema({
    image: {
        type: String, require: true
    }
},
{timestamps:true})

const imageUpload = mongoose.model('imageUpload', replySchema)

module.exports = imageUpload