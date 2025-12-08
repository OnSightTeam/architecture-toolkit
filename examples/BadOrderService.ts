/**
 * Example file with SOLID violations for testing the validator
 * This file intentionally violates multiple SOLID principles
 */

// This class violates SRP, OCP, and DIP
class OrderService {
  // DIP Violation: Direct dependency on MySQL
  private database = new MySQLDatabase();

  // SRP Violation: Mixed concerns - persistence, validation, formatting, and business logic
  processOrder(order: Order) {
    // Validation logic
    if (!order.customerId || !order.items || order.items.length === 0) {
      throw new Error('Invalid order');
    }

    // Business logic
    const total = this.calculateTotal(order);

    // Persistence logic - DIP violation
    this.database.save(order);

    // Formatting logic - SRP violation
    this.printReceipt(order);

    // Email logic - SRP violation
    this.sendConfirmationEmail(order);

    return total;
  }

  // OCP Violation: Switch statement requiring modification for new types
  calculateShipping(order: Order): number {
    switch (order.shippingType) {
      case 'GROUND':
        return 5.0;
      case 'AIR':
        return 10.0;
      case 'EXPRESS':
        return 20.0;
      default:
        throw new Error('Unknown shipping type');
    }
  }

  // OCP Violation: instanceof checks
  applyDiscount(customer: Customer): number {
    if (customer instanceof PremiumCustomer) {
      return 0.2;
    } else if (customer instanceof RegularCustomer) {
      return 0.1;
    }
    return 0;
  }

  private calculateTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.price, 0);
  }

  // SRP Violation: Formatting logic in business class
  private printReceipt(order: Order): void {
    console.log('=== RECEIPT ===');
    console.log(`Order ID: ${order.id}`);
    console.log(`Total: $${this.calculateTotal(order)}`);
  }

  // SRP Violation: Email logic in business class
  private sendConfirmationEmail(order: Order): void {
    console.log(`Sending email to customer ${order.customerId}`);
  }
}

// Mock classes
class MySQLDatabase {
  save(order: Order): void {
    console.log('Saving to MySQL:', order.id);
  }
}

interface Order {
  id: string;
  customerId: string;
  items: Array<{ name: string; price: number }>;
  shippingType: string;
}

interface Customer {
  id: string;
  name: string;
}

class PremiumCustomer implements Customer {
  id: string;
  name: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

class RegularCustomer implements Customer {
  id: string;
  name: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
