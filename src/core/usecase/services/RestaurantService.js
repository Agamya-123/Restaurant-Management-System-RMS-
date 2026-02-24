import { TableStatus } from '../../domain/enums/SystemEnums.js';
import { Reservation, Order } from '../../domain/model/DomainModels.js';

export class RestaurantService {
    constructor(tables, menu) {
        this.tables = tables;
        this.menu = menu;
        this.reservations = [];
        this.orders = [];
    }

    // Reservation Use Cases
    searchAvailableTables(capacity, date, time) {
        // Simulating search logic
        return this.tables.filter(t => t.capacity >= capacity && t.status === TableStatus.FREE);
    }

    makeReservation(tableId, customerName, time, partySize) {
        const table = this.tables.find(t => t.id === tableId);
        
        // Applying Optimistic Locking simulation
        if (table && table.reserve()) {
            const reservation = new Reservation(
                `RES-${Date.now()}`,
                tableId,
                customerName,
                time,
                partySize
            );
            this.reservations.push(reservation);
            return { success: true, reservation };
        }
        return { success: false, message: "Table no longer available or not found." };
    }

    // Order Use Cases
    createOrder(tableId, waiterId) {
        const table = this.tables.find(t => t.id === tableId);
        if (table && table.status === TableStatus.OCCUPIED) {
             return this.orders.find(o => o.tableId === tableId && o.status === 'active');
        }

        const order = new Order(`ORD-${Date.now()}`, tableId, waiterId);
        this.orders.push(order);
        
        if (table) table.status = TableStatus.OCCUPIED;
        
        return order;
    }

    updateOrderStatus(orderId, status) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            return true;
        }
        return false;
    }

    cancelReservation(reservationId) {
        const res = this.reservations.find(r => r.id === reservationId);
        if (res) {
            res.status = 'cancelled';
            const table = this.tables.find(t => t.id === res.tableId);
            if (table) table.status = TableStatus.FREE;
            return true;
        }
        return false;
    }

    processPayment(orderId, method) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'paid';
            const table = this.tables.find(t => t.id === order.tableId);
            if (table) table.status = TableStatus.FREE; // Table becomes free after payment
            return { success: true, total: order.calculateTotal() };
        }
        return { success: false };
    }
}
