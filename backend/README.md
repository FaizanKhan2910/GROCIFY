# GROCIFY — Backend Service Boundary

This directory is reserved for backend APIs, order processing, inventory sync, and server-side pricing verification.

### Business Invariants to Enforce Server-Side
- **Product Price Ceiling**: Reject any item with selling price > ₹1,000.
- **Delivery Calculation**: Enforce ₹499 free shipping threshold (₹59 standard shipping fee for orders < ₹499).
- **Payment Verification**: Verify Razorpay / UPI callbacks securely; do not trust client-side amounts.
