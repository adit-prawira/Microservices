import { Publisher, Subjects, TicketCreatedEvent } from "@apticketz/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
