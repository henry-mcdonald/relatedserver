const router = require('express').Router()
const Post = require('../models/Post.js')
const User = require('../models/User.js')
const Comment = require('../models/Comment.js')
const Reply = require('../models/Reply.js')
const authLockedRoute = require('./authLockedRoute')


router.post('/:replyId/like-the-reply', authLockedRoute, async (req, res)=>{
    try {
        const userId = res.locals.user.id
        const findReply = await Reply.findById(req.params.replyId)

        if(findReply.users_who_liked.includes(userId) === true){
            findReply.users_who_liked.pull({_id: userId})
            await findReply.save()
        }else{
            findReply.users_who_liked.push(userId)
            await findReply.save()
        }

        res.json(findReply)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "liking a reply did not work"})
    }
})

//Edit a reply
router.put('/:replyId/edit-reply', authLockedRoute, async (req, res)=>{
    try {
        const userId = res.locals.user.id
        const findReply = await Reply.findById({
            _id: req.params.replyId
        })
        const replyAuthorId = findReply.user._id.toString()
        if(userId === replyAuthorId){
            const updateReply = await Reply.findByIdAndUpdate(
                {_id: req.params.replyId},
                {$set: {content: req.body.content}},
                {new: true})
            res.json(updateReply)
        }else{
            res.json({error: "THATs not YOUR reply!! Change your own! Filthy Hobbitses!!" })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: "editing your reply did not work"})
    }
})

router.delete('/:replyId/delete-reply', authLockedRoute, async (req, res)=>{
    try {
        const userId = res.locals.user.id
        const findReply = await Reply.findById(req.params.replyId)
        const replyAuthorId = findReply.user._id.toString()

        if(replyAuthorId === userId){
            const deleteReply = await Reply.findByIdAndDelete({
                _id: req.params.replyId
            })
            res.json(deleteReply)
        }else{
            res.json({msg: "ERRRRORRRRR. You can't delete another person's Reply!"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: "cannot delete Comment.  Error occured."})
    }
})



module.exports = router