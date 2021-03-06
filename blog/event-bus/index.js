const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const events = [];
app.use(bodyParser.json());
app.post("/events", (req, res) => {
    const event = req.body;

    events.push(event);

    //Post Services
    axios.post("http://posts-clusterip-srv:4000/events", event);

    //Comment Services
    axios.post("http://comments-srv:4001/events", event);

    //Query Services
    axios.post("http://query-srv:4002/events", event);

    //Moderation Services
    axios.post("http://moderation-srv:4003/events", event);

    res.send({ status: "All OK" });
});

app.get("/events", (req, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log("Listening on 4005");
});
