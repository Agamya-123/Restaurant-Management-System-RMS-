import { MealItem } from '../../core/domain/model/MealItem.js';

export class MenuManager {
    static getSeedMenu() {
        return [
            new MealItem(1, 'Truffle Mushroom Risotto', 'Creamy carnaroli rice with wild mushrooms and black truffle oil.', 24.50, 'Mains', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800'),
            new MealItem(2, 'Pan-Seared Scallops', 'Jumbo scallops with parsnip purée and brown butter sauce.', 18.00, 'Appetizers', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800'),
            new MealItem(3, 'Heritage Beef Burger', 'Dry-aged beef, cave-aged cheddar, and caramelized onion jam.', 28.00, 'Mains', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800'),
            new MealItem(4, 'Warm Chocolate Fondant', 'Decadent dark chocolate lava cake with vanilla gelato.', 12.50, 'Desserts', 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=800'),
            new MealItem(5, 'Lobster Thermidor', 'Rich and creamy lobster meat baked with brandy and gruyere.', 45.00, 'Premium', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800'),
            new MealItem(6, 'Classic Caesar', 'Crisp romaine, wagyu beef bacon, and 24-month aged parmesan.', 16.00, 'Appetizers', 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&q=80&w=800'),
            new MealItem(7, 'Saffron Sea Bass', 'Chilean sea bass with saffron-infused beurre blanc.', 38.50, 'Mains', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800'),
            new MealItem(8, 'Passionfruit Pavlova', 'Light meringue with passionfruit curd and fresh gold berries.', 14.00, 'Desserts', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800'),
        ];
    }
}
