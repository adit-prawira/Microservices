import { Subjects, Publisher, PaymentCreatedEvent } from "@apticketz/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
