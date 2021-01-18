import { Stan } from "node-nats-streaming";
import { resolve } from "path";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}
export abstract class Publisher<T extends Event> {
    abstract subject: T["subject"];
    private client: Stan;
    constructor(client: Stan) {
        this.client = client;
    }
    publish(data: T["data"]): Promise<void> {
        return new Promise(() => {
            this.client.publish(this.subject, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                console.log("Event published", this.subject);
                return resolve();
            });
        });
    }
}
function reject(err: Error): void {
    throw new Error("Function not implemented.");
}
