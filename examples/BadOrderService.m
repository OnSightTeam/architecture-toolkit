#import <Foundation/Foundation.h>

// SOLID Violations Example - Objective-C
// This class demonstrates multiple SOLID principle violations for testing

@class DatabaseConnection;

// SRP Violation: Class has multiple responsibilities
// - Order processing
// - Database persistence
// - Email sending
// - Formatting
@interface OrderService : NSObject

// DIP Violation: Direct reference to concrete class
@property (strong, nonatomic) DatabaseConnection *database;

// F2 Violation: Too many parameters (>3)
- (double)processOrderWithType:(NSString *)orderType
                   customerName:(NSString *)customerName
                          email:(NSString *)email
                          items:(NSArray *)items
                   discountCode:(NSString *)discountCode;

// LSP Violation: Type checking method
- (BOOL)isPremiumCustomer:(id)customer;

// ISP Violation: Methods that shouldn't be together
- (void)sendEmailTo:(NSString *)email message:(NSString *)message;

// G5: Code duplication
- (double)calculateDiscount:(double)total code:(NSString *)code;

// G5: Code duplication - similar to calculateDiscount
- (double)applyMemberDiscount:(double)total memberLevel:(NSString *)level;

// F1 Violation: Long method
- (BOOL)validateOrderWithItems:(NSArray *)items
                       customer:(NSString *)customer
                        payment:(NSString *)payment
                       shipping:(NSString *)shipping
                        billing:(NSString *)billing;

// E1: Empty error handling
- (NSDictionary *)fetchOrderById:(NSString *)orderId;

@end

@implementation OrderService

- (instancetype)init {
    self = [super init];
    if (self) {
        // DIP Violation: Direct instantiation of concrete class
        _database = [[DatabaseConnection alloc] init];
    }
    return self;
}

// F2 Violation: Too many parameters (>3)
- (double)processOrderWithType:(NSString *)orderType
                   customerName:(NSString *)customerName
                          email:(NSString *)email
                          items:(NSArray *)items
                   discountCode:(NSString *)discountCode {

    double total = 0.0;

    // Calculate total
    for (NSString *item in items) {
        total += 10.0;  // G4: Magic number
    }

    // OCP Violation: Switch statement on type
    if ([orderType isEqualToString:@"premium"]) {
        total *= 0.9;  // G4: Magic number
    } else if ([orderType isEqualToString:@"regular"]) {
        total *= 0.95;  // G4: Magic number
    } else if ([orderType isEqualToString:@"vip"]) {
        total *= 0.8;  // G4: Magic number
    }

    // SRP Violation: Saving to database (persistence concern)
    NSDictionary *orderData = @{@"total": @(total), @"customer": customerName};
    [self.database saveOrder:orderData];

    // SRP Violation: Sending email (notification concern)
    [self sendEmailTo:email message:[NSString stringWithFormat:@"Order processed: %.2f", total]];

    // SRP Violation: Formatting concern
    NSLog(@"Order Total: $%.2f", total);

    return total;
}

// LSP Violation: Type checking in method
- (BOOL)isPremiumCustomer:(id)customer {
    // LSP Violation: Using type checking instead of polymorphism
    if ([customer isKindOfClass:[NSString class]]) {
        NSString *name = (NSString *)customer;
        return [name hasPrefix:@"VIP"];
    }
    return NO;
}

- (void)sendEmailTo:(NSString *)email message:(NSString *)message {
    // TODO: Implement email sending  // C1: TODO comment
    NSLog(@"Sending email to %@", email);
}

// G5: Code duplication
- (double)calculateDiscount:(double)total code:(NSString *)code {
    if ([code isEqualToString:@"SAVE10"]) {
        return total * 0.9;  // G4: Magic number
    } else if ([code isEqualToString:@"SAVE20"]) {
        return total * 0.8;  // G4: Magic number
    }
    return total;
}

// G5: Code duplication - similar logic as calculateDiscount
- (double)applyMemberDiscount:(double)total memberLevel:(NSString *)level {
    if ([level isEqualToString:@"gold"]) {
        return total * 0.9;  // G4: Magic number
    } else if ([level isEqualToString:@"platinum"]) {
        return total * 0.8;  // G4: Magic number
    }
    return total;
}

// F1 Violation: Long method (>20 lines)
- (BOOL)validateOrderWithItems:(NSArray *)items
                       customer:(NSString *)customer
                        payment:(NSString *)payment
                       shipping:(NSString *)shipping
                        billing:(NSString *)billing {

    // G28: Complex boolean expression
    if (items.count > 0 && customer.length > 0 && payment.length > 0 &&
        shipping.length > 0 && billing.length > 0) {

        // Nested conditions (G16: Obscured intent)
        if ([payment isEqualToString:@"credit"] || [payment isEqualToString:@"debit"]) {
            if (![shipping isEqualToString:billing]) {
                return items.count < 100 ? YES : NO;  // G16: Unnecessary ternary
            } else {
                return YES;
            }
        }
    }
    return NO;
}

// E1: Empty error handling
- (NSDictionary *)fetchOrderById:(NSString *)orderId {
    @try {
        return [self.database fetchOrderById:orderId];
    }
    @catch (NSException *exception) {
        // E1: Empty catch block - swallowing errors
        return nil;
    }
}

@end

// C4: Commented out code
// - (double)oldProcessOrder:(Order *)order {
//     double total = [order calculateTotal];
//     [self.database saveTotal:total];
//     return total;
// }

// G7: God class - too many responsibilities
@interface DatabaseConnection : NSObject

- (void)saveOrder:(NSDictionary *)order;
- (NSDictionary *)fetchOrderById:(NSString *)orderId;
- (void)deleteOrderById:(NSString *)orderId;
- (void)updateOrder:(NSString *)orderId withData:(NSDictionary *)data;
- (NSArray *)queryWithSQL:(NSString *)sql;

@end

@implementation DatabaseConnection

- (void)saveOrder:(NSDictionary *)order {
    // Database logic
}

- (NSDictionary *)fetchOrderById:(NSString *)orderId {
    // Database logic
    return @{};
}

- (void)deleteOrderById:(NSString *)orderId {
    // Database logic
}

- (void)updateOrder:(NSString *)orderId withData:(NSDictionary *)data {
    // Database logic
}

- (NSArray *)queryWithSQL:(NSString *)sql {
    // Database logic
    return @[];
}

@end

// ISP Violation: Fat protocol with too many methods
@protocol OrderProcessor <NSObject>

- (double)processOrder:(NSDictionary *)order;
- (BOOL)cancelOrderById:(NSString *)orderId;
- (BOOL)refundOrderById:(NSString *)orderId;
- (BOOL)updateOrderById:(NSString *)orderId withData:(NSDictionary *)data;
- (NSString *)trackOrderById:(NSString *)orderId;
- (BOOL)archiveOrderById:(NSString *)orderId;
- (NSString *)exportOrderById:(NSString *)orderId;
- (BOOL)printOrderById:(NSString *)orderId;
- (BOOL)emailOrderById:(NSString *)orderId to:(NSString *)email;
- (BOOL)validateOrderById:(NSString *)orderId;
- (double)calculateTaxForOrder:(NSDictionary *)order;
- (double)calculateShippingForOrder:(NSDictionary *)order;

@end
