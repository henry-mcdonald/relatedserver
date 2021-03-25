//seed DB with sampler data 
const bcrypt = require('bcryptjs')
const faker = require('faker')
require('./models')

const User = require('./models/User')
const Post = require('./models/Post')
const Comment = require('./models/Comment')
const Reply = require('./models/Reply')

// clear tables so that every 
async function clearCollections() {
    await User.deleteMany({})
    await Post.deleteMany({})
    await Comment.deleteMany({})
    await Reply.deleteMany({})
}


const seedrandom = require('seedrandom')
seedrandom('hello.', { global: true }) //seeds Math.random for consistency
faker.seed(123);

const topics = ["Wheelchair Accessability", "Community Events",
    "Local Meetups", "Awareness"]  // list of sample topics
const conditions = ["Cystic Fibrosis", "Paralysis", "Cerebral Palsy", "Autism",
    "Chronic Bone Disease", "Cancer", "Phenylketonuria", "Other",
    "Surgical Complications"] // sample conditions
const zips = [60657, 60613, 60614] // list of sample zips
const relations = ["self", "mother", "father", "caregiver", "brother"]

// perform round of hashing
const saltRounds = 12

let hashedPassword
async function setHashedPassword() {
    hashedPassword = await bcrypt.hash("a", saltRounds)
}
setHashedPassword()
//return single fake zip
function createFakeZip() {
    const randomZip = zips[Math.floor(Math.random() * zips.length)]
    return randomZip
}
// createFakeZip();

//return single fake relation
function createFakeRelation() {
    const randomRelation = relations[Math.floor(Math.random() * relations.length)]
    return randomRelation
}

//return 1 up to n fake topics
function createFakeTopics() {
    const userTopics = []
    const numberOfSubscribedTopics = Math.ceil(Math.random() * topics.length)
    for (let i = 0; i < numberOfSubscribedTopics; i++) {
        const randIndex = Math.floor(Math.random() * topics.length)
        if (!userTopics.includes(topics[randIndex])) {
            userTopics.push(topics[randIndex])
        }
    }
    return userTopics
}
// createFakeTopics();
// returns generally 1 but sometimes 2 conditions

function createFakeConditions() {
    const userConditions = []
    let numberOfUserConditions = Math.ceil(Math.random() * conditions.length)
    if (numberOfUserConditions > 2) {

        // make it somewhat unlikely to have 2 conditions
        if (Math.random() > 0.15) {
            numberOfUserConditions = 1
        } else {
            numberOfUserConditions = 2
        }
    }
    for (let i = 0; i < numberOfUserConditions; i++) {
        const randIndex = Math.floor(Math.random() * conditions.length)
        if (!userConditions.includes(conditions[randIndex])) {
            userConditions.push(conditions[randIndex])
        }
    }
    return userConditions
}

// createFakeConditions();


async function createSomeUsers(n_records) {
    if (!n_records) {
        n_records = 50 //default to create 50 dummy records
    }
    for (let i = 0; i < n_records; i++) {
        const record = await User.create({
            email: faker.internet.email(),
            username: faker.name.firstName(),
            password: hashedPassword,
            relation: createFakeRelation(),
            topics_of_interest: createFakeTopics(),
            disability_tags: createFakeConditions(),
            zip: createFakeZip(),
            county: "Placeholder County ",

        })
        console.log(record)
    }
}
// createSomeUsers();

async function findARandomUser() {
    // const count = await User.count()
    // console.log(count)
    randomUser = await User.aggregate([{ $match: {} }, { $sample: { size: 1 } }])
    return randomUser[0]

}

async function findSomeRandomUsers() {
    const maxNumberWhoLiked = 10
    const numberWhoDidLike = Math.floor(Math.random() * maxNumberWhoLiked)
    const idArray = []
    for (let i = 0; i < numberWhoDidLike; i++) {
        const newCandidate = await findARandomUser()
        if (!idArray.includes(newCandidate)) {
            idArray.push(newCandidate)
        }
    }
    return idArray
}

async function findARandomReply(){
    randomReply = await Reply.aggregate([{ $match: {} }, { $sample: { size: 1 } }])
    return randomReply[0]._id
}



async function findARandomComment() {
    randomComment = await Comment.aggregate([{ $match: {} }, { $sample: { size: 1 } }])
    return randomComment[0]._id
}





async function createSomePosts(n_posts,n_comments,n_replies) {
    if (!n_posts) {
        n_posts = 21//default to create 20 dummy posts
    }   
    if (!n_comments) {
        n_comments = 5 //default to create 20 dummy posts
    }   
    if (!n_replies) {
        n_replies = 3 //default to create 20 dummy posts
    }   
    for(let i = 0; i< n_posts; i++){
        const newPost = await Post.create({
            discussion_tags: createFakeTopics(),
            content: faker.lorem.paragraph(Math.floor(Math.random() * 5)),
            user: await findARandomUser(),
            users_who_liked: await findSomeRandomUsers(),
            comments: []

        })

        for(let j = 0 ; j< Math.floor(Math.random()*n_comments); j++){
            const newComment = await Comment.create({
                content: faker.lorem.sentences(Math.ceil(Math.random() * 3)),
                user: await findARandomUser(),
                users_who_liked: await findSomeRandomUsers(),
                post: newPost._id,
                replies: []
            })
            for(let k =0 ; k<Math.floor(Math.random()*n_replies); k++){
                
                const newReply = await Reply.create({
                    content: faker.lorem.sentences(Math.ceil(Math.random() * 2)),
                    user: await findARandomUser(),
                    users_who_liked: await findSomeRandomUsers(),
                    comment:newComment._id
                })

                newComment.replies.push(newReply._id)
                await newComment.save()
            }


            newPost.comments.push(newComment._id)
            await newPost.save()

        }
        console.log(newPost)
    }
}




async function seedFullDatabase() {
    await clearCollections()
    await createSomeUsers()
    await createSomePosts()
}
seedFullDatabase()
//findARandomUserId()


async function dbTest(){

}

// for(i=0;i<50;i++){
//     //console.log(createFakeZip())
//     console.log(createFakeConditions())
// }
