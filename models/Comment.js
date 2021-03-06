const mongoose =  require('mongoose')


const commentSchema = new mongoose.Schema({
    content: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    users_who_liked: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    replies:  [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Reply'
    }],
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
},{
    timestamps: true
})

const Reply = mongoose.model('Comment', commentSchema)
module.exports = Reply