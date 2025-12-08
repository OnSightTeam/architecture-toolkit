"""
Bad Order Service Example - Python Version
Demonstrates multiple SOLID violations and code smells
"""

import sqlite3
import json
from datetime import datetime


class OrderService:
    """
    This class violates SRP - it has multiple responsibilities:
    - Order processing
    - Database persistence
    - Email sending
    - Formatting
    """

    def __init__(self):
        self.db = sqlite3.connect('orders.db')  # DIP violation - direct dependency
        self.cursor = self.db.cursor()

    def process_order(self, order_type, customer_name, email, items, discount_code):
        """
        F2 violation - too many parameters (5 parameters)
        """
        # Calculate total
        total = 0
        for item in items:
            total += item['price'] * item['quantity']

        # Apply discount - OCP violation (switch on type)
        if order_type == 'premium':
            total = total * 0.9
        elif order_type == 'regular':
            total = total * 0.95
        elif order_type == 'wholesale':
            total = total * 0.8

        # Validate discount code
        if discount_code:
            if discount_code == 'SAVE10':
                total = total * 0.9
            elif discount_code == 'SAVE20':
                total = total * 0.8

        # Save to database - SRP violation (mixed concerns)
        self.cursor.execute(
            'INSERT INTO orders (customer, total, date) VALUES (?, ?, ?)',
            (customer_name, total, datetime.now())
        )
        self.db.commit()

        # Send email - SRP violation
        self.send_email(email, total)

        # Format and return - SRP violation
        return self.format_order(customer_name, total)

    def send_email(self, email, total):
        """Simulated email sending"""
        # TODO: implement actual email sending
        print(f"Email sent to {email} for ${total}")

    def format_order(self, customer_name, total):
        """Format order details"""
        return json.dumps({
            'customer': customer_name,
            'total': total,
            'timestamp': str(datetime.now())
        })

    def get_order_by_id(self, order_id):
        """Query orders - mixed with business logic"""
        self.cursor.execute('SELECT * FROM orders WHERE id = ?', (order_id,))
        return self.cursor.fetchone()

    def is_premium_customer(self, customer_name):
        """Check if customer is premium - LSP potential violation"""
        # Type checking suggests LSP issue
        if isinstance(customer_name, str):
            return customer_name.startswith('VIP')
        return False

    # Commented out old code - C4 violation
    # def old_process_order(self, order):
    #     total = order.calculate()
    #     return total

    # Magic number - N4 violation
    def calculate_shipping(self, weight):
        if weight > 50:  # Magic number
            return 25.99  # Magic number
        return 9.99  # Magic number
