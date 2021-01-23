import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@apticketz/common";

const app = express();

app.set("trust proxy", 1);
app.use(json());
app.use(
    cookieSession({
        signed: false,

        // Check if the software is being tested in secure
        // environment(https) or not(http)
        secure: process.env.NODE_ENV !== "test",
    })
);

// Authenticate if a user is signed in
app.use(currentUser);

// throw an error for any unidentified url
app.all("*", async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
