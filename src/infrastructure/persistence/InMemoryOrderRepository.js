export class InMemoryOrderRepository {
    constructor() {
        this.orders = new Map();
    }

    async save(order) {
        this.orders.set(order.id, order);
    }

    async findById(id) {
        return this.orders.get(id);
    }

    async findAll() {
        return Array.from(this.orders.values());
    }

    async update(order) {
        this.orders.set(order.id, order);
    }
}
