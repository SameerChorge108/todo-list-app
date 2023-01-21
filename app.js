const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

const items = [];
const workItems = [];

app.get("/", function (req, res) {

    const day = date.getDay();
    res.render("list", { ListTitle: day, lists: items });
})

app.post("/", function (req, res) {
    const item = req.body.newItem;

    if (req.body.button === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }

})

app.get("/work", function (req, res) {

    res.render("list", { ListTitle: "Work List", lists: workItems });
})

app.get("/about", function (req, res) {

    res.render("about");
})

app.listen(3000, function () {
    console.log("Server is running on port 3000....");
})