export class CreateReservationRequest {
    constructor(tableId, customerId, time, partySize) {
        this.tableId = tableId;
        this.customerId = customerId;
        this.time = time;
        this.partySize = partySize;
    }
}

export class PaymentRequest {
    constructor(method, amount) {
        this.method = method; // CREDIT_CARD, CHECK, CASH
        this.amount = amount;
    }
}

export class ReservationResponse {
    constructor(id, tableId, status, message) {
        this.id = id;
        this.tableId = tableId;
        this.status = status;
        this.message = message;
    }
}
