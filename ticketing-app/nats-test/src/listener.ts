import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
    url: "http://localhost:4222",
});

stan.on("connect", () => {
    console.log("Listener connected to NATS");

    // Stop events when client is offline
    stan.on("close", () => {
        console.log("NATS connection closed!");
        process.exit();
    });

    new TicketCreatedListener(stan).listen();
});

// Interrupt signal every time ts node dev tries to restart the program
process.on("SIGINT", () => stan.close());

// Terminate signal every time ts node dev tries to restart the program
process.on("SIGTERM", () => stan.close());
