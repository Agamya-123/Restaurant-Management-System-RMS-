export class MealItem {
    constructor(id, name, description, price, category, image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
        this.image = image;
        this.isAvailable = true;
    }

    updatePrice(newPrice) {
        this.price = newPrice;
    }

    toggleAvailability() {
        this.isAvailable = !this.isAvailable;
    }
}

export class MenuSection {
    constructor(title) {
        this.title = title;
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }
}
