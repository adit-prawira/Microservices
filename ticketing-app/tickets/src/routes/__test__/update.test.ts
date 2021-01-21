import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";
it("returns 404 if the provided id does not exist", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .set("Cookie", global.signin())
        .send({
            title: "title",
            price: 10,
        })
        .expect(404);
});

it("returns 401 if the user does not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: "title",
            price: 10,
        })
        .expect(401);
});

it("returns 401 if the user does not own the ticket", async () => {
    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title: "ticket",
            price: 20,
        });
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", global.signin())
        .send({
            title: "ticket2",
            price: 13,
        })
        .expect(401);
});

it("returns 400 if the user provide an invalid title or price", async () => {
    const cookie = global.signin();
    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "ticket",
            price: 10,
        });

    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "",
            price: 10,
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "ticket",
            price: -10,
        })
        .expect(400);
});

it("updates the ticket by provided valid inputs", async () => {
    const cookie = global.signin();
    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "ticket",
            price: 10,
        });
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "new ticket",
            price: 200,
        })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${res.body.id}`)
        .send();
    expect(ticketResponse.body.title).toEqual("new ticket");
    expect(ticketResponse.body.price).toEqual(200);
});

it("publishes an event", async () => {
    const cookie = global.signin();
    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "ticket",
            price: 10,
        });
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "new ticket",
            price: 200,
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates fit eh ticket is reserved", async () => {
    const cookie = global.signin();
    const res = await request(app)
        .post("/api/tickets")
        .set("Cookie", cookie)
        .send({
            title: "ticket",
            price: 10,
        });

    const ticket = await Ticket.findById(res.body.id);
    ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();
    await request(app)
        .put(`/api/tickets/${res.body.id}`)
        .set("Cookie", cookie)
        .send({
            title: "new ticket",
            price: 200,
        })
        .expect(400);
});
