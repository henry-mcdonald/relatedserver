const mongoose =  require('mongoose')

//Subdocument Schema
//Subdocument Schema
const replySchema = new mongoose.Schema({
    content: {
        type: String,  
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    users_who_liked: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

})

const commentSchema = new mongoose.Schema({
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment_reply: {
        type: String
    },
    replies: [replySchema]
},{
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)
const Reply = mongoose.model('Reply', replySchema)

module.exports = {
    Reply,
    Comment
}
