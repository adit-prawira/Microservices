import { Publisher, OrderCreatedEvent, Subjects } from "@apticketz/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
