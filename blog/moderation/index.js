const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

app.post("/events", async (req, res) => {
    const { type, data } = req.body;

    //Find and change status of the new created comments
    //by the condition whether or not it contains a word "orange"
    if (type === "CommentCreated") {
        const status = data.content.includes("orange")
            ? "rejected"
            : "approved";
        await axios.post("http://event-bus-srv:4005/events", {
            type: "CommentModerated",
            data: {
                id: data.id,
                postId: data.postId,
                content: data.content,
                status,
            },
        });
    }
    res.send({});
});

app.listen(4003, () => {
    console.log("Listening to 4003");
});
