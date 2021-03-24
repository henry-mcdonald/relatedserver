const router = require('express').Router()
const Post = require('../models/Post.js')
const User = require('../models/User.js')
const Comment = require('../models/Comment.js')
const Reply = require('../models/Reply.js')
const authLockedRoute = require('./authLockedRoute')


router.post('/:commentId/add-reply', authLockedRoute, async (req, res) =>{
    try {
        const userId = res.locals.user.id
        const reply = await new Reply({
            content: req.body.content,
            user: userId
        })
        reply.save()
        const findComment = await Comment.findById(req.params.commentId).populate({
            path:'replies',
            select: "content"
        }).populate({
            path:'replies',
            populate: {
                path: 'user',
                select: 'username'
            }
        })
        findComment.replies.push(reply)
        await findComment.save()

        res.json({ findComment: findComment })

    } catch (error) {
        console.log(error)
        res.status(500).json( {msg: "adding a comment failed"} ) 
    }
})




module.exports = router