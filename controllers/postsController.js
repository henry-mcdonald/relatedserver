const router = require('express').Router()
const Post = require('../models/Post.js')
const User = require('../models/User.js')
const authLockedRoute = require('./authLockedRoute')



router.get('/', authLockedRoute, async (req, res) =>{
    let postData = {}
    let user = null
    let usersname = null
    let usersLiked = null
    try {

        const findPosts = await Post.find({})
       
        async function addPostData () {


            for(i=0; i < findPosts.length; i++ ){
                user = await User.findById(
                findPosts[i].user_id
                )
            }
            
            console.log(user)
            
            
            // usersname = user.username
            // postData.push(usersname)
            // postData.push(post.content)

            // for(const post of findPosts) {
                //     user = await User.findById({
            //         id: post.user_id
            //     })
            // }
            // findPosts.forEach(async post => {
            //    user = await User.findById({
            //        id: post.user_id
            //    })
            // })

        }
        addPostData();

        // console.log(postData)

        res.json({ findPosts: findPosts  })

        
    } catch (error) {
        console.log(error)
        res.status(500).json( {msg: "Finding all posts failed"} )
    }
    
})

module.exports = router