var express = require("express")
var router = express.Router()

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource")
})
router.get("/addForm", function (req, res, next) {
    const title = "Add"
    res.render("addForm", { title })
})

module.exports = router
