import mongoose from "mongoose";
import { app } from "./app";
const startDatabase = async () => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET must be defined");
    }
    try {
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
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
