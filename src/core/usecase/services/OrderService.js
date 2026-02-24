import { OrderStatus } from '../../domain/enums/OrderStatus.js';
import { TableStatus } from '../../domain/enums/TableStatus.js';
import { Order } from '../../domain/model/Order.js';

export class OrderService {
    constructor(tableRepository, orderRepository, paymentGateway) {
        this.tableRepository = tableRepository;
        this.orderRepository = orderRepository;
        this.paymentGateway = paymentGateway;
    }

    /**
     * API: POST /orders
     */
    async createOrder(tableId, waiterId = 'W1') {
        const order = new Order(`ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, tableId, waiterId);
        await this.orderRepository.save(order);
        await this.tableRepository.updateStatus(tableId, TableStatus.OCCUPIED, null);
        return order;
    }

    /**
     * API: GET /orders/{orderId}
     */
    async getOrder(id) {
        return await this.orderRepository.findById(id);
    }

    /**
     * API: PUT /orders/{orderId}
     * Used for updating status (Preparing, Complete) or adding items
     */
    async updateOrder(id, updateDto) {
        const orderDoc = await this.orderRepository.findById(id);
        if (!orderDoc) return null;

        // Reconstruct domain object to use addMeal logic
        const order = new Order(orderDoc.id, orderDoc.tableId, orderDoc.waiterId);
        order.status = orderDoc.status;
        order.orderItems = orderDoc.orderItems || [];
        order.totalAmount = orderDoc.totalAmount || 0;

        if (updateDto.status) order.status = updateDto.status;
        if (updateDto.items) {
            updateDto.items.forEach(item => order.addMeal(item.mealItem, item.quantity));
        }

        await this.orderRepository.update(order);
        return order;
    }

    /**
     * API: POST /orders/{orderId}/payment
     */
    async processPayment(orderId, paymentRequest) {
        const orderDoc = await this.orderRepository.findById(orderId);
        if (!orderDoc) throw new Error("Order not found");

        const paymentResult = await this.paymentGateway.process(paymentRequest.method, paymentRequest.amount);
        
        if (paymentResult.success) {
            const order = new Order(orderDoc.id, orderDoc.tableId, orderDoc.waiterId);
            order.status = OrderStatus.PAID;
            order.orderItems = orderDoc.orderItems || [];
            order.totalAmount = orderDoc.totalAmount || 0;
            order.paidAt = new Date();
            order.paymentMethod = paymentRequest.method;

            await this.orderRepository.update(order);
            await this.tableRepository.updateStatus(orderDoc.tableId, TableStatus.FREE, null);
            return { success: true, transactionId: paymentResult.transactionId };
        }
        
        return { success: false, message: "Transaction Denied" };
    }
}
