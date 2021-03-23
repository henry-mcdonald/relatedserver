const mongoose =  require('mongoose')


const replySchema = new mongoose.Schema({
    content: {
        type: String,  
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    users_who_liked: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserComment'
    }
})

const Reply = mongoose.model('Reply', replySchema)

module.exports = Reply