import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const startDatabase = async () => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be defined");
    }
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }
    try {
        await natsWrapper.connect("ticketing", "asdf", "http://nats-srv:4222");

        // Graceful shutdown
        natsWrapper.client.on("close", () => {
            console.log("NATS connection closed");
            process.exit();
        });
        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        // Connect to mongoose
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error(err);
    }
    app.listen(3000, () => {
        console.log("Listening on port 3000");
    });
};

startDatabase();
