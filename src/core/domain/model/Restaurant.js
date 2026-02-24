export class Restaurant {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.branches = [];
    }

    addBranch(branch) {
        this.branches.push(branch);
    }
}

export class Branch {
    constructor(id, restaurantId, name, address, phone) {
        this.id = id;
        this.restaurantId = restaurantId;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.tables = [];
        this.menu = null;
    }
}
