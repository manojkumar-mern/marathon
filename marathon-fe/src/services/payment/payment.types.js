/**
 * @typedef {Object} CreateOrderRequest
 * @property {number} amount - Amount in smallest currency unit (paise for INR)
 * @property {string} [currency] - Currency code, defaults to INR
 * @property {string} receipt - Unique receipt identifier for this order
 * @property {string} registrationId - Registration ID this payment is for
 */

/**
 * @typedef {Object} CreateOrderResponse
 * @property {string} id - Gateway order ID
 * @property {number} amount - Order amount in smallest currency unit
 * @property {number} amount_paid - Amount paid so far
 * @property {number} amount_due - Amount remaining
 * @property {string} currency - Currency code
 * @property {string} receipt - Receipt identifier
 * @property {string} status - Order status
 * @property {number} attempts - Number of payment attempts
 * @property {string} key_id - Gateway key ID (needed by frontend SDK)
 * @property {number} created_at - Timestamp
 */

/**
 * @typedef {Object} VerifyPaymentRequest
 * @property {string} razorpay_payment_id - Payment ID from Razorpay
 * @property {string} razorpay_order_id - Order ID from Razorpay
 * @property {string} razorpay_signature - Signature for verification
 * @property {string} registrationId - Associated registration ID
 */

/**
 * @typedef {Object} VerifyPaymentResponse
 * @property {string} status - Payment status after verification
 * @property {string} paymentId - Internal payment record ID
 * @property {string} registrationId - Registration ID
 */

/**
 * @typedef {Object} PaymentRecord
 * @property {string} id - Internal payment ID
 * @property {string} registrationId - Associated registration
 * @property {string} userId - User who made the payment
 * @property {string} marathonId - Associated marathon
 * @property {number} amount - Amount in smallest currency unit
 * @property {string} currency - Currency code
 * @property {string} gateway - Gateway name (razorpay, stripe)
 * @property {string} gatewayOrderId - Order ID from gateway
 * @property {string} gatewayPaymentId - Payment ID from gateway
 * @property {string} status - Payment status
 * @property {string} receipt - Receipt identifier
 * @property {string} createdAt - Creation timestamp
 * @property {string} paidAt - Payment completion timestamp
 */

/**
 * @typedef {Object} RazorpayCheckoutOptions
 * @property {string} key - Razorpay Key ID
 * @property {string} order_id - Order ID from backend
 * @property {number} amount - Amount in paise
 * @property {string} currency - Currency code
 * @property {string} name - Merchant display name
 * @property {string} [description] - Payment description
 * @property {string} [image] - Merchant logo URL
 * @property {Object} [prefill] - Prefilled customer details
 * @property {string} [prefill.name]
 * @property {string} [prefill.email]
 * @property {string} [prefill.contact]
 * @property {Object} [theme] - Theme customization
 * @property {string} [theme.color] - Theme color in hex
 */

/**
 * @typedef {Object} PaymentError
 * @property {string} code - Machine-readable error code
 * @property {string} message - Human-readable error message
 * @property {*} [original] - Original error/payload if available
 */

export default {}
