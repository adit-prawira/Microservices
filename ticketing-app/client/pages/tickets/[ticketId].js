import useRequest from "../../hooks/use-request";
import Router from "next/router";
const TicketShow = ({ ticket }) => {
    const { doRequest, errors } = useRequest({
        url: "/api/orders",
        method: "post",
        body: {
            ticketId: ticket.id,
        },
        onSuccess: (order) =>
            Router.push("/orders/[orderId]", `/orders/${order.id}`),
    });
    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>Price: {ticket.price}</h4>
            <h4>Status: {}</h4>
            {errors}
            <button onClick={() => doRequest()} className="btn btn-primary">
                Purchase
            </button>
        </div>
    );
};
TicketShow.getInitialProps = async (context, client) => {
    // Extract ticketId from the url.
    // Example: ticketing.dev / new /tickets/jaskldhkldhj
    // Then ticketId = jaskldhkldhj
    const { ticketId } = context.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data };
};
export default TicketShow;
