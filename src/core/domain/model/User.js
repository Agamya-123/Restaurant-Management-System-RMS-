export class Person {
    constructor(id, name, email, phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
    }
}

export class Customer extends Person {
    constructor(id, name, email, phone) {
        super(id, name, email, phone);
        this.lastVisit = new Date();
    }
}

export class Employee extends Person {
    constructor(id, name, email, phone, employeeId) {
        super(id, name, email, phone);
        this.employeeId = employeeId;
        this.dateJoined = new Date();
    }
}

export class Waiter extends Employee {
    constructor(id, name, email, phone, employeeId) {
        super(id, name, email, phone, employeeId);
    }
}

export class Receptionist extends Employee {
    constructor(id, name, email, phone, employeeId) {
        super(id, name, email, phone, employeeId);
    }
}
