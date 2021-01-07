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
    axios.post("http://localhost:4000/events", event);

    //Comment Services
    axios.post("http://localhost:4001/events", event);

    //Query Services
    axios.post("http://localhost:4002/events", event);

    //Moderation Services
    axios.post("http://localhost:4003/events", event);

    // Virtual machines
    // axios.post("http://localhost:4006/events", event);

    // axios.post("http://localhost:4007/events", event);

    res.send({ status: "All OK" });
});

app.get("/events", (req, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log("Listening on 4005");
});
