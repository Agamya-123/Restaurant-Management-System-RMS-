import { OrderStatus } from '../enums/OrderStatus.js';

export class Order {
    constructor(id, tableId, waiterId) {
        this.id = id;
        this.tableId = tableId;
        this.waiterId = waiterId;
        this.status = OrderStatus.RECEIVED;
        this.orderItems = [];
        this.totalAmount = 0;
        this.createdAt = new Date();
    }

    addMeal(mealItem, quantity = 1) {
        const existingItem = this.orderItems.find(item => item.mealItem.id === mealItem.id);
        if (existingItem) {
            existingItem.quantity += quantity;
            if (existingItem.quantity <= 0) {
                this.orderItems = this.orderItems.filter(item => item.mealItem.id !== mealItem.id);
            }
        } else if (quantity > 0) {
            this.orderItems.push(new OrderItem(mealItem, quantity));
        }
        this.calculateTotal();
    }

    calculateTotal() {
        this.totalAmount = this.orderItems.reduce((acc, item) => acc + (item.priceAtPurchase * item.quantity), 0);
        return this.totalAmount;
    }
}

export class OrderItem {
    constructor(mealItem, quantity) {
        this.mealItem = mealItem;
        this.quantity = quantity;
        this.priceAtPurchase = mealItem.price;
    }

    updateQuantity(q) {
        this.quantity = q;
    }
}
