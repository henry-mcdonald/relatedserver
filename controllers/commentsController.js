const router = require('express').Router()
const Post = require('../models/Post.js')
const User = require('../models/User.js')
const Comment = require('../models/Comment.js')
const Reply = require('../models/Reply.js')
const authLockedRoute = require('./authLockedRoute')



//Replying to a comment
router.post('/:commentId/add-reply', authLockedRoute, async (req, res) =>{
    try {
        const userId = res.locals.user.id
        const reply = await new Reply({
            content: req.body.content,
            user: userId
        })
        reply.save()
        const findComment = await Comment.findById(
        {_id: req.params.commentId}
        ).populate({
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
        res.status(500).json( {msg: "adding a reply failed"} ) 
    }
})

//Like a comment
router.post('/:commentId/like-the-comment', authLockedRoute, async (req, res)=>{
    try {
        const userId = res.locals.user.id
        const findComment = await Comment.findById(req.params.commentId)
        
        if(findComment.users_who_liked.includes(userId) === true) {
            findComment.users_who_liked.pull({_id: userId})
            await findComment.save()
        }else{
            findComment.users_who_liked.push(userId)
            await findComment.save()
        }
        res.json(findComment)

    } catch (error) {
        console.log(error)
        res.status(500).json( { msg: "liking a comment failed"} )
    }
})

//Edit a comment
router.put('/:commentId/edit-comment', authLockedRoute, async (req, res)=>{
    try {
        const userId = res.locals.user.id
        const findComment = await Comment.findById({
            _id: req.params.commentId
        })
        const commentAuthorId = findComment.user._id.toString()

        if(userId === commentAuthorId){
            const updateComment = await Comment.findByIdAndUpdate(
                {_id: req.params.commentId},
                {$set: {content: req.body.content}},
                {new: true})
            res.json(updateComment)
        }else{
            res.json({error: "Whoopsie, you're not supposed to change someone else's comment!"})
        }
        

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "editing the comment failed"})
    }
})



module.exports = router