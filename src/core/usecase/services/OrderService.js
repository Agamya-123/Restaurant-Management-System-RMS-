import { OrderStatus } from '../../domain/enums/OrderStatus.js';
import { TableStatus } from '../../domain/enums/TableStatus.js';
import { Order } from '../../domain/model/Order.js';

export class OrderService {
    constructor(tableRepository, orderRepository, paymentGateway) {
        this.tableRepository = tableRepository;
        this.orderRepository = orderRepository;
        this.paymentGateway = paymentGateway;
    }

    /** POST /orders — creates the main billing order for a table */
    async createOrder(tableId, waiterId = 'W1') {
        const order = new Order(`ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, tableId, waiterId);
        
        // Safety: Clear any "zombie" sub-orders from previous sessions that might be lingering
        const allOrders = await this.orderRepository.findAll();
        const legacySubOrders = allOrders.filter(o => 
            o.tableId === tableId && 
            o.isSubOrder && 
            !['PAID', 'SERVED'].includes(o.status)
        );
        for (const sub of legacySubOrders) {
            await this.orderRepository.update({ ...sub, status: OrderStatus.PAID });
        }

        await this.orderRepository.save(order);
        await this.tableRepository.updateStatus(tableId, TableStatus.OCCUPIED, null);
        return order;
    }

    /**
     * POST /orders/batch — creates a kitchen-round sub-order.
     * Carries ONLY the delta items for that round, starts in PREPARING,
     * isSubOrder=true so billing ignores it.
     */
    async createBatchOrder(tableId, waiterId = 'W1', items = []) {
        const order = new Order(`ORD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`, tableId, waiterId);
        order.status = OrderStatus.PREPARING;
        order.isSubOrder = true;
        order.checkedItems = [];
        items.forEach(item => order.addMeal(item.mealItem, item.quantity));
        await this.orderRepository.save(order);
        return order;
    }

    /** GET /orders/{orderId} */
    async getOrder(id) {
        return await this.orderRepository.findById(id);
    }

    /** PUT /orders/{orderId} — update status or add items */
    async updateOrder(id, updateDto) {
        const orderDoc = await this.orderRepository.findById(id);
        if (!orderDoc) return null;

        const order = new Order(orderDoc.id, orderDoc.tableId, orderDoc.waiterId);
        order.status       = orderDoc.status;
        order.orderItems   = orderDoc.orderItems || [];
        order.totalAmount  = orderDoc.totalAmount || 0;
        order.checkedItems = orderDoc.checkedItems || [];
        order.isSubOrder   = orderDoc.isSubOrder ?? false;

        if (updateDto.status) order.status = updateDto.status;
        if (updateDto.items)  updateDto.items.forEach(item => order.addMeal(item.mealItem, item.quantity));
        if (updateDto.checkedItems !== undefined) order.checkedItems = updateDto.checkedItems;

        await this.orderRepository.update(order);
        return order;
    }

    /** POST /orders/{orderId}/payment */
    async processPayment(orderId, paymentRequest) {
        const orderDoc = await this.orderRepository.findById(orderId);
        if (!orderDoc) throw new Error('Order not found');

        const paymentResult = await this.paymentGateway.process(paymentRequest.method, paymentRequest.amount);

        if (paymentResult.success) {
            const order = new Order(orderDoc.id, orderDoc.tableId, orderDoc.waiterId);
            order.status      = OrderStatus.PAID;
            order.orderItems  = orderDoc.orderItems || [];
            order.totalAmount = orderDoc.totalAmount || 0;
            order.paidAt      = new Date();
            order.paymentMethod = paymentRequest.method;

            await this.orderRepository.update(order);
            await this.tableRepository.updateStatus(orderDoc.tableId, TableStatus.FREE, null);

            // Close all sub-orders (kitchen rounds) for this table so KDS/pickup clears
            const allOrders = await this.orderRepository.findAll();
            const subOrders = allOrders.filter(o =>
                o.tableId === orderDoc.tableId &&
                o.isSubOrder &&
                !['PAID', 'SERVED'].includes(o.status)
            );
            for (const sub of subOrders) {
                const subOrder = new Order(sub.id, sub.tableId, sub.waiterId);
                subOrder.status    = OrderStatus.PAID;
                subOrder.orderItems = sub.orderItems || [];
                subOrder.isSubOrder = true;
                subOrder.checkedItems = sub.checkedItems || [];
                await this.orderRepository.update(subOrder);
            }

            return { success: true, transactionId: paymentResult.transactionId };
        }

        return { success: false, message: 'Transaction Denied' };
    }
}
