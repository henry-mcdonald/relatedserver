const router = require('express').Router()
const User = require('../models/User.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')


router.post('/register', async (req, res) => {
    try {

        const findUser = await User.findOne({
            email: req.body.email
        })

        if (findUser) return res.json({ error: 'Email Already exists' })

        const findUserName = await User.findOne({
            username: req.body.username,
        })


        if(findUserName) return res.json({ error: 'Choose a different username' })


        const password = req.body.password
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)


        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            zip: req.body.zip,
            county: req.body.county
        })
        await newUser.save()

        // res.json({newUser})

        const payload = {
            email: newUser.email,
            username: newUser.username,
            zip: newUser.zip,
            county: newUser.county,
            id: newUser.id,
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 1000000 })
        res.json({ token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: '🔥 OH NO server error on register route' })
    }
})

router.post('/login', async (req, res) => {
    try {
        const foundUser = await User.findOne({
            username: req.body.username
        })

        const noLoginMessage = 'Incorrect username or password'
        
        if(!foundUser) return res.status(400).json({msg: noLoginMessage})

        const matchPassword = await bcrypt.compare(req.body.password, foundUser.password)
        
        if(!matchPassword) return res.status(400).json({ msg: noLoginMessage})

        const payload = {
            username: foundUser.username,
            email: foundUser.email,
            id: foundUser.id
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 600000000 })
        res.json({ token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: '🔥 OH NO server error on login route' })
    }

})



router.get('/auth-locked/news-feed', authLockedRoute, async (req, res) => {

})

router.get('/profile', authLockedRoute, async (req, res) => {
    try {
        console.log(res.locals.user.id)
        const userInfo = await User.findById(res.locals.user.id)

        if (userInfo) {
            res.json({                 
                username: userInfo.username,
                about_user: userInfo.about_me,
                relation: userInfo.relation,
                topics_of_interest: userInfo.topics_of_interest,
                email: userInfo.email
            })
        } else {
            res.json({ about_me: "not found. Are you logged in??" })
        }
    } catch(error) {
        console.log(error)
        res.status(500).json({ msg: '🔥 OH NO server error on get profile route' })

    }

})

router.post('/profile', authLockedRoute, async(req,res) => { // have to authlock
    try{
        const userInfo = await User.findById(res.locals.user.id)

        if(userInfo){
            userInfo.about_me = req.body.edited_profile
            await userInfo.save()
            res.json({                 
                username: userInfo.username,
                about_user: userInfo.about_me,
                relation: userInfo.relation,
                topics_of_interest: userInfo.topics_of_interest,
                email: userInfo.email
            })
        } else{
            res.json({msg: "user not found"})
        }

    } catch(error){
        console.log(error)
        res.status(500).json({ msg: '🔥 OH NO server error on put profile route' })
    }
})


router.get('/:userId', authLockedRoute, async (req, res) => {

    try {
        const userId = req.params.userId
        const userFind = await User.findById(userId)
        if (userFind) {
            res.json({
                username: userFind.username,
                about_user: userFind.about_me,
                relation: userFind.relation,
                topics_of_interest: userFind.topics_of_interest
            })
        } else {

            res.json({ about_user: "user not found" })

        }

    } catch(error){
        console.log(error)
        res.status(500).json({ msg: '🔥 OH NO server error on get userId route' })

    }
})

//User uploads an image

router.post('/image-upload', authLockedRoute, async (req, res)=>{
    try {
        console.log(req,"req")
        console.log(req.files,"req.files")
        const user = res.locals.user.id
        const imageUpload = await User.findByIdAndUpdate(
           {_id: user}, 
           {$set: {image: req.file.path}},
           {new: true}
        )
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "error occured while trying to upload image"})
    }
})



module.exports = router