import Foundation
import UIKit

// SOLID Violations Example - Swift
// This class demonstrates multiple SOLID principle violations for testing

// SRP Violation: Class has multiple responsibilities
// - Order processing
// - Database persistence
// - Email sending
// - Formatting
class OrderService {
    // DIP Violation: Direct instantiation of concrete class
    let database = DatabaseConnection()

    // F2 Violation: Too many parameters (>3)
    func processOrder(orderType: String, customerName: String, email: String, items: [String], discountCode: String) -> Double {
        var total = 0.0

        // Calculate total
        for item in items {
            total += 10.0  // G4: Magic number
        }

        // OCP Violation: Switch statement on type
        switch orderType {
        case "premium":
            total *= 0.9  // G4: Magic number
        case "regular":
            total *= 0.95  // G4: Magic number
        case "vip":
            total *= 0.8  // G4: Magic number
        default:
            break
        }

        // SRP Violation: Saving to database (persistence concern)
        database.save(order: ["total": total, "customer": customerName])

        // SRP Violation: Sending email (notification concern)
        sendEmail(to: email, message: "Order processed: \(total)")

        // SRP Violation: Formatting concern
        print("Order Total: $\(String(format: "%.2f", total))")

        return total
    }

    // LSP Violation: Type checking in method
    func isPremiumCustomer(customer: Any) -> Bool {
        // LSP Violation: Using type checking instead of polymorphism
        if customer is String {
            let name = customer as! String
            return name.hasPrefix("VIP")
        }
        return false
    }

    // ISP Violation: Methods that shouldn't be together
    func sendEmail(to: String, message: String) {
        // TODO: Implement email sending  // C1: TODO comment
        print("Sending email to \(to)")
    }

    // G5: Code duplication
    func calculateDiscount(total: Double, code: String) -> Double {
        switch code {
        case "SAVE10":
            return total * 0.9  // G4: Magic number
        case "SAVE20":
            return total * 0.8  // G4: Magic number
        default:
            return total
        }
    }

    // G5: Code duplication - similar logic as calculateDiscount
    func applyMemberDiscount(total: Double, memberLevel: String) -> Double {
        switch memberLevel {
        case "gold":
            return total * 0.9  // G4: Magic number
        case "platinum":
            return total * 0.8  // G4: Magic number
        default:
            return total
        }
    }

    // F1 Violation: Long method (>20 lines)
    func validateOrder(items: [String], customer: String, payment: String, shipping: String, billing: String) -> Bool {
        // G28: Complex boolean expression
        if items.count > 0 && !customer.isEmpty && !payment.isEmpty && !shipping.isEmpty && !billing.isEmpty {
            // Nested conditions (G16: Obscured intent)
            if payment == "credit" || payment == "debit" {
                if shipping != billing {
                    return items.count < 100 ? true : false  // G16: Unnecessary ternary
                } else {
                    return true
                }
            }
        }
        return false
    }

    // E1: Empty error handling
    func fetchOrder(id: String) -> [String: Any]? {
        do {
            return try database.fetch(id: id)
        } catch {
            // E1: Empty catch block - swallowing errors
            return nil
        }
    }
}

// C4: Commented out code
// func oldProcessOrder(order: Order) {
//     let total = order.calculateTotal()
//     database.save(total)
// }

// G7: God class - too many responsibilities
class DatabaseConnection {
    func save(order: [String: Any]) {
        // Database logic
    }

    func fetch(id: String) throws -> [String: Any] {
        // Database logic
        return [:]
    }

    func delete(id: String) {
        // Database logic
    }

    func update(id: String, data: [String: Any]) {
        // Database logic
    }

    func query(sql: String) -> [[String: Any]] {
        // Database logic
        return []
    }
}

// ISP Violation: Fat protocol with too many methods
protocol OrderProcessor {
    func processOrder(order: [String: Any]) -> Double
    func cancelOrder(id: String) -> Bool
    func refundOrder(id: String) -> Bool
    func updateOrder(id: String, data: [String: Any]) -> Bool
    func trackOrder(id: String) -> String
    func archiveOrder(id: String) -> Bool
    func exportOrder(id: String) -> String
    func printOrder(id: String) -> Bool
    func emailOrder(id: String, to: String) -> Bool
    func validateOrder(id: String) -> Bool
    func calculateTax(order: [String: Any]) -> Double
    func calculateShipping(order: [String: Any]) -> Double
}
