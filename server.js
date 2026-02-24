import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// DB connection
import { connectDB } from './src/infrastructure/db/connection.js';

// Domain & Services
import { TableStatus } from './src/core/domain/enums/TableStatus.js';
import { OrderStatus } from './src/core/domain/enums/OrderStatus.js';
import { UserRole } from './src/core/domain/enums/UserRole.js';

import { ReservationService } from './src/core/usecase/services/ReservationService.js';
import { OrderService } from './src/core/usecase/services/OrderService.js';

// MongoDB Repositories
import { MongoTableRepository }       from './src/infrastructure/persistence/MongoTableRepository.js';
import { MongoReservationRepository } from './src/infrastructure/persistence/MongoReservationRepository.js';
import { MongoOrderRepository }       from './src/infrastructure/persistence/MongoOrderRepository.js';
import { MongoMenuRepository }        from './src/infrastructure/persistence/MongoMenuRepository.js';

import { StripePaymentGateway } from './src/infrastructure/external/payment/StripePaymentGateway.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ─── Repositories ─────────────────────────────────────────────────────────────
const tableRepo       = new MongoTableRepository();
const reservationRepo = new MongoReservationRepository();
const orderRepo       = new MongoOrderRepository();
const menuRepo        = new MongoMenuRepository();
const paymentGateway  = new StripePaymentGateway();

const reservationService = new ReservationService(tableRepo, reservationRepo);
const orderService       = new OrderService(tableRepo, orderRepo, paymentGateway);

// ─── Users (Static RBAC store — extend to DB later if needed) ─────────────────
const USERS = [
    { id: 'admin1',  username: 'admin',  role: UserRole.ADMIN,  password: '123' },
    { id: 'waiter1', username: 'waiter', role: UserRole.WAITER, password: '123' },
    { id: 'chef1',   username: 'chef',   role: UserRole.CHEF,   password: '123' },
];

// ─── Time-Window Reservation Scheduler ────────────────────────────────────────
const RESERVATION_WINDOW_MINUTES = 30;

const syncReservationStatuses = async () => {
    const now = new Date();
    const allReservations = await reservationRepo.findAll();

    for (const res of allReservations) {
        const table = await tableRepo.findById(res.tableId);
        if (!table) continue;

        const [hours, minutes] = (res.reservationTime || '00:00').split(':').map(Number);
        const slot = new Date(now);
        slot.setHours(hours, minutes, 0, 0);
        const diffMin = (slot - now) / 60000;

        const isInWindow = diffMin >= -RESERVATION_WINDOW_MINUTES && diffMin <= RESERVATION_WINDOW_MINUTES;

        if (isInWindow && table.status === TableStatus.FREE) {
            await tableRepo.updateStatus(res.tableId, TableStatus.RESERVED, null);
            console.log(`[SCHEDULER] Table ${res.tableId} → RESERVED (${res.reservationTime})`);
        }

        if (!isInWindow && table.status === TableStatus.RESERVED) {
            const allOrders = await orderRepo.findAll();
            const hasActiveOrder = allOrders.some(o => o.tableId === res.tableId && o.status !== OrderStatus.PAID);
            if (!hasActiveOrder) {
                await tableRepo.updateStatus(res.tableId, TableStatus.FREE, null);
                console.log(`[SCHEDULER] Table ${res.tableId} → FREE (window expired)`);
            }
        }
    }
};

// ─── Bootstrap ────────────────────────────────────────────────────────────────
const bootstrap = async () => {
    await connectDB();
    await tableRepo.seed();

    // Warm up menu cache
    await menuRepo.findAll();

    // Start reservation scheduler
    syncReservationStatuses();
    setInterval(syncReservationStatuses, 60 * 1000);

    app.listen(PORT, () => {
        console.log(`[Savoria] API Engine active → http://localhost:${PORT}`);
    });
};

// ─── API ROUTES ───────────────────────────────────────────────────────────────

app.post('/api/v1/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
        const { password: _, ...safe } = user;
        res.json(safe);
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

/** USERS: list & create (Admin) */
app.get('/api/v1/users', (req, res) => {
    res.json(USERS.map(({ password: _, ...safe }) => safe));
});

app.post('/api/v1/users', (req, res) => {
    const { username, role, password } = req.body;
    if (!username || !role || !password) return res.status(400).json({ error: 'Missing fields' });
    
    const newUser = {
        id: `u${Date.now()}`,
        username,
        role,
        password
    };
    USERS.push(newUser);
    const { password: _, ...safe } = newUser;
    res.status(201).json(safe);
});

app.delete('/api/v1/users/:id', (req, res) => {
    const idx = USERS.findIndex(u => u.id === req.params.id);
    if (idx !== -1) {
        USERS.splice(idx, 1);
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

/** MENU: get all */
app.get('/api/v1/menu', async (req, res) => {
    try {
        res.json(await menuRepo.findAll());
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** MENU: create (Admin) */
app.post('/api/v1/menu', async (req, res) => {
    try {
        const item = await menuRepo.create(req.body);
        res.status(201).json(item);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** MENU: toggle availability (Chef/Admin) */
app.patch('/api/v1/menu/:id', async (req, res) => {
    try {
        const item = await menuRepo.updateAvailability(req.params.id, req.body.isAvailable);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** TABLES: available */
app.get('/api/v1/branches/:branchId/tables/available', async (req, res) => {
    try {
        const tables = await tableRepo.findAllByBranch(req.params.branchId);
        res.json(tables.filter(t => t.status === TableStatus.FREE));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** TABLES: create (Admin) */
app.post('/api/v1/tables', async (req, res) => {
    try {
        const { id, capacity } = req.body;
        if (!id || !capacity) return res.status(400).json({ error: 'id and capacity are required.' });
        const table = await tableRepo.createTable(id.trim().toUpperCase(), parseInt(capacity));
        res.status(201).json(table);
    } catch (e) {
        const status = e.message.includes('already exists') ? 409 : 500;
        res.status(status).json({ error: e.message });
    }
});

/** RESERVATIONS: create */
app.post('/api/v1/reservations', async (req, res) => {
    try {
        const result = await reservationService.makeReservation(req.body);
        if (result.status === 'CONFIRMED') res.status(201).json(result);
        else if (result.status === 'CONFLICT') res.status(409).json(result);
        else res.status(400).json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** RESERVATIONS: cancel */
app.delete('/api/v1/reservations/:id', async (req, res) => {
    try {
        const result = await reservationService.cancelReservation(req.params.id);
        if (result.success) res.json({ message: 'Reservation cancelled and table released.' });
        else res.status(404).json({ error: 'Reservation not found' });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** ORDERS: create */
app.post('/api/v1/orders', async (req, res) => {
    try {
        const { tableId, waiterId } = req.body;
        const order = await orderService.createOrder(tableId, waiterId || 'W1');
        res.status(201).json(order);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** ORDERS: create kitchen-round sub-order (separate card per round on KDS) */
app.post('/api/v1/orders/batch', async (req, res) => {
    try {
        const { tableId, waiterId, items } = req.body;
        const order = await orderService.createBatchOrder(tableId, waiterId || 'W1', items || []);
        res.status(201).json(order);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** ORDERS: update (add items / status change / checkedItems) */
app.put('/api/v1/orders/:id/status', async (req, res) => {
    try {
        const { status, items, checkedItems } = req.body;
        const order = await orderService.updateOrder(req.params.id, { status, items, checkedItems });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** ORDERS: chef checks/unchecks an individual item */
app.patch('/api/v1/orders/:id/check', async (req, res) => {
    try {
        const { checkedItems } = req.body; // full array of checked mealItem.id strings
        const order = await orderService.updateOrder(req.params.id, { checkedItems });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ success: true, checkedItems: order.checkedItems });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** ORDERS: cancel (only empty RECEIVED orders — accidental table click) */
app.delete('/api/v1/orders/:id', async (req, res) => {
    try {
        const order = await orderRepo.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        
        // Safety: only allow freeing via DELETE if main order is empty OR if called from waiter console
        // (Added sub-order cleanup here as well)
        const allOrders = await orderRepo.findAll();
        const tableSubOrders = allOrders.filter(o => 
            o.tableId === order.tableId && 
            o.isSubOrder && 
            !['PAID', 'SERVED'].includes(o.status)
        );

        for (const sub of tableSubOrders) {
            await orderRepo.update({ ...sub, status: 'PAID' });
        }

        // Free the table
        await tableRepo.updateStatus(order.tableId, TableStatus.FREE, null);
        // Delete the main order document
        await orderRepo.delete(req.params.id);
        res.json({ success: true, message: `Order cancelled, Table ${order.tableId} freed.` });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** ORDERS: attach kitchen note */
app.patch('/api/v1/orders/:id/note', async (req, res) => {
    try {
        const { note } = req.body;
        const order = await orderRepo.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        order.note = note;
        await order.save();
        res.json({ success: true, note });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** ORDERS: add to billing total (for sub-order amounts when main order is already READY) */
app.patch('/api/v1/orders/:id/total', async (req, res) => {
    try {
        const { addAmount } = req.body;
        const order = await orderRepo.findById(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        // Reconstruct with new total only — don't touch orderItems
        const { Order } = await import('./src/core/domain/model/Order.js');
        const o = new Order(order.id, order.tableId, order.waiterId);
        o.status = order.status;
        o.orderItems = order.orderItems || [];
        o.checkedItems = order.checkedItems || [];
        o.isSubOrder = order.isSubOrder ?? false;
        o.totalAmount = (order.totalAmount || 0) + (addAmount || 0);
        await orderRepo.update(o);
        res.json({ success: true, totalAmount: o.totalAmount });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** PAYMENTS: settle bill */
app.post('/api/v1/orders/:orderId/payment', async (req, res) => {
    try {
        const { orderId } = req.params;
        // Fetch the order doc first so we can link reservation cleanup
        const order = await orderRepo.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const result = await orderService.processPayment(orderId, req.body);

        if (result.success) {
            // Remove any reservation tied to this table — guest has checked out
            const allReservations = await reservationRepo.findAll();
            const linked = allReservations.find(r => r.tableId === order.tableId);
            if (linked) {
                await reservationRepo.delete(linked.id);
                console.log(`[PAYMENT] Cleared reservation ${linked.id} for Table ${order.tableId}`);
            }
            res.json(result);
        } else {
            res.status(402).json(result);
        }
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** BILLING HISTORY: only exposed for Admin use */
app.get('/api/v1/bills', async (req, res) => {
    try {
        const all = await orderRepo.findAll();
        const paid = all.filter(o => o.status === OrderStatus.PAID);
        res.json(paid);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

/** STATE SNAPSHOT for UI refresh */
app.get('/api/v1/state', async (req, res) => {
    try {
        const [tables, reservations, orders, menu] = await Promise.all([
            tableRepo.findAllByBranch('B1'),
            reservationRepo.findAll(),
            orderRepo.findAll(),
            menuRepo.findAll(),
        ]);

        const revenue = orders
            .filter(o => o.status === OrderStatus.PAID)
            .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

        res.json({ tables, reservations, orders, revenue, menu, users: USERS.map(({ password: _, ...s }) => s) });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

bootstrap();
