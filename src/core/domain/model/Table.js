import { TableStatus } from '../enums/TableStatus.js';

export class Table {
    constructor(id, tableNumber, capacity) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.capacity = capacity;
        this.status = TableStatus.FREE;
        this.version = 1; // For Optimistic Locking
        this.seats = []; // Granular control
    }

    addSeat(seat) {
        this.seats.push(seat);
    }

    isAvailable() {
        return this.status === TableStatus.FREE;
    }
}

export class Seat {
    constructor(id, seatNumber, type = 'REGULAR') {
        this.id = id;
        this.seatNumber = seatNumber;
        this.type = type;
    }
}
