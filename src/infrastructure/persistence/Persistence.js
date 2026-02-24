import { Table, MealItem } from '../../core/domain/model/DomainModels.js';
import { TableStatus } from '../../core/domain/enums/SystemEnums.js';

export class PersistenceManager {
    static getInitialData() {
        const tables = [
            new Table('T1', 2, TableStatus.FREE),
            new Table('T2', 2, TableStatus.OCCUPIED),
            new Table('T3', 4, TableStatus.FREE),
            new Table('T4', 4, TableStatus.RESERVED),
            new Table('T5', 6, TableStatus.FREE),
            new Table('T6', 6, TableStatus.OCCUPIED),
            new Table('T7', 2, TableStatus.FREE),
            new Table('T8', 4, TableStatus.FREE),
        ];

        const menu = [
            new MealItem(1, 'Truffle Mushroom Risotto', 24.50, 'Creamy carnaroli rice with wild mushrooms and black truffle oil.', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=500', 'Mains'),
            new MealItem(2, 'Pan-Seared Scallops', 18.00, 'Jumbo scallops with parsnip purée and brown butter sauce.', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=500', 'Appetizers'),
            new MealItem(3, 'Heritage Beef Burger', 28.00, 'Dry-aged beef, cave-aged cheddar, and caramelized onion jam.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500', 'Mains'),
            new MealItem(4, 'Chocolate Matcha Fondant', 12.50, 'Warm dark chocolate and ceremonial grade matcha lava cake.', 'https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?auto=format&fit=crop&q=80&w=500', 'Desserts'),
        ];

        return { tables, menu };
    }
}
