import { ReservationStatus } from '../enums/ReservationStatus.js';

export class Reservation {
    constructor(id, tableId, customerId, reservationTime, partySize) {
        this.id = id;
        this.tableId = tableId;
        this.customerId = customerId;
        this.reservationTime = reservationTime;
        this.partySize = partySize;
        this.status = ReservationStatus.CONFIRMED;
        this.createdAt = new Date();
    }
}
