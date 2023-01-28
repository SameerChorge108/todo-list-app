const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

mongoose.connect("mongodb+srv://admin:admin@cluster0.pvghf2j.mongodb.net/todolistDB");
// const items = [];
// const workItems = [];
const itemSchema = {
    name: String
};


const defaultList = [];
const Item = mongoose.model("Item", itemSchema);

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {
    Item.find({}, function (err, foundItems) {
        res.render("list", { ListTitle: "Today", lists: foundItems });
    });

})

app.get("/:customeList", function (req, res) {
    const customeListName = _.capitalize(req.params.customeList);

    List.findOne({ name: customeListName }, function (err, foundItem) {
        if (!err) {
            if (!foundItem) {
                const listData = new List({
                    name: customeListName,
                    items: defaultList
                });
                listData.save();
                res.redirect("/" + customeListName);
            }
            else {
                res.render("list", { ListTitle: foundItem.name, lists: foundItem.items });
            }
        }

    });

})

app.post("/", function (req, res) {
    const item = req.body.newItem;
    const listName = req.body.button;

    const itemData = new Item({
        name: item
    });
    if (listName === "Today") {
        itemData.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName }, function (err, foundItems) {
            foundItems.items.push(itemData);
            foundItems.save();
            res.redirect("/" + listName);
        });
    }


})

app.post("/delete", function (req, res) {
    const itemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(itemId, function (err) {
            if (err) {
                console.log("Failed to delete id" + itemId);
            }
            else {
                console.log("Deleted successfully....");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: itemId } } }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
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

function sendItemToMongo(value) {
    const itemData = new Item({
        name: value
    });

    return itemData;
}