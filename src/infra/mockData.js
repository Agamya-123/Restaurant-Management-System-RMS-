export const mockData = {
    tables: [
        { id: 'T1', capacity: 2, status: 'free' },
        { id: 'T2', capacity: 2, status: 'occupied' },
        { id: 'T3', capacity: 4, status: 'free' },
        { id: 'T4', capacity: 4, status: 'reserved' },
        { id: 'T5', capacity: 6, status: 'free' },
        { id: 'T6', capacity: 6, status: 'occupied' },
        { id: 'T7', capacity: 2, status: 'free' },
        { id: 'T8', capacity: 4, status: 'free' },
    ],
    menu: [
        { id: 1, name: 'Truffle Mushroom Risotto', category: 'Mains', price: 24.50, description: 'Creamy carnaroli rice with wild mushrooms and black truffle oil.', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=500' },
        { id: 2, name: 'Pan-Seared Scallops', category: 'Appetizers', price: 18.00, description: 'Jumbo scallops with parsnip purée and brown butter sauce.', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=500' },
        { id: 3, name: 'Heritage Beef Burger', category: 'Mains', price: 28.00, description: 'Dry-aged beef, cave-aged cheddar, and caramelized onion jam.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500' },
        { id: 4, name: 'Chocolate Matcha Fondant', category: 'Desserts', price: 12.50, description: 'Warm dark chocolate and ceremonial grade matcha lava cake.', image: 'https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?auto=format&fit=crop&q=80&w=500' },
    ],
    stats: {
        totalRevenue: '$1,240.50',
        activeOrders: 8,
        occupancy: '75%',
        waitlist: 3
    }
};
