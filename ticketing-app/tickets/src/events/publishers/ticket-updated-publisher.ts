import { Publisher, Subjects, TicketUpdatedEvent } from "@apticketz/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
