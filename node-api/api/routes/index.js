var express = require("express")
const axios = require("axios")
var router = express.Router()
const Redis = require("ioredis")
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env
// console.log(REDIS_HOST, REDIS_PORT, REDIS_PASSWORD)
const redis = new Redis({
    port: REDIS_PORT, // Redis port
    host: REDIS_HOST, // Redis host
    username: "default", // needs Redis >= 6
    password: REDIS_PASSWORD,
    db: 0, // Defaults to 0
})
const USERS_API = "https://jsonplaceholder.typicode.com/users/"
router.get("/", (req, res) => {
    res.json({ messages: "hit / , users ,cached-users" })
})
router.get("/users", (req, res) => {
    const a = 'update@5'
    console.log(a)
    try {
        axios.get(`${USERS_API}`).then(function (response) {
            const users = response.data
            console.log("Users retrieved from the API")
            res.status(200).send(users)
        })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.get("/cached-users", async (req, res) => {
    const f = 'modify 2'
    console.log(f)
    try {

        redis.get("users2", async (err, data) => {
            if (err) {
                console.error(err)
                throw err
            }

            if (data) {
                console.log("Users retrieved from Redis=================")
                res.status(200).send(JSON.parse(data))
            } else {
                const result = await axios.get(`${USERS_API}`)
                const users = result.data
                await redis
                    .set("users2", JSON.stringify(users), "ex", 5)
                    .then((resolved) => {
                        console.log("resolved", resolved)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                console.log("Users retrieved from the API")
                res.status(200).send({ users })
            }
        })
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})
router.get("/delete-users", async (req, res) => {
    try {
        console.log("delete")
        await redis
            .del("users")
            .then((resolve) => {
                console.log(resolve)
                res.json({ resolve })
            })
            .catch((err) => {
                console.log(err)
            })
    } catch (error) {
        res.json({ error: error })
    }
})
module.exports = router
//test