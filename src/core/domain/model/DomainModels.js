import { TableStatus } from '../enums/SystemEnums.js';

export class Table {
    constructor(id, capacity, status = TableStatus.FREE) {
        this.id = id;
        this.capacity = capacity;
        this.status = status;
        this.version = 1; // For Optimistic Locking as mentioned in the requirements
    }

    isAvailable() {
        return this.status === TableStatus.FREE;
    }

    reserve() {
        if (this.isAvailable()) {
            this.status = TableStatus.RESERVED;
            this.version++;
            return true;
        }
        return false;
    }
}

export class MealItem {
    constructor(id, name, price, description, image, category) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.image = image;
        this.category = category;
    }
}

export class Reservation {
    constructor(id, tableId, customerName, time, partySize) {
        this.id = id;
        this.tableId = tableId;
        this.customerName = customerName;
        this.time = time;
        this.partySize = partySize;
        this.status = 'confirmed';
        this.createdAt = new Date();
    }
}

export class Order {
    constructor(id, tableId, waiterId) {
        this.id = id;
        this.tableId = tableId;
        this.waiterId = waiterId;
        this.items = [];
        this.status = 'active';
        this.createdAt = new Date();
    }

    addItem(mealItem, quantity = 1) {
        this.items.push({ mealItem, quantity, priceAtPurchase: mealItem.price });
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.priceAtPurchase * item.quantity), 0);
    }
}
