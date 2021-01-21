import { OrderCancelledEvent, Publisher, Subjects } from "@apticketz/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
