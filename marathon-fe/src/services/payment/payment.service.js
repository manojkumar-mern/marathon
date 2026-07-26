import { api, ApiError } from '../api.js'
import { razorpayProvider } from './providers/razorpay.provider.js'
import { DEFAULT_CURRENCY } from './payment.constants.js'

function toPaymentError(err) {
  if (err.code && err.message) return err

  if (err instanceof ApiError) {
    if (err.status === 401) {
      return { code: 'SESSION_EXPIRED', message: 'Your session has expired. Please log in again.' }
    }
    return { code: 'BACKEND_ERROR', message: err.message, original: err.data }
  }

  return { code: 'NETWORK_ERROR', message: err.message || 'Something went wrong. Please try again.' }
}

export const paymentService = {
  async createOrder({ amount, currency = DEFAULT_CURRENCY, receipt, registrationId }) {
    try {
      const res = await api.post('/payments/create-order', {
        amount,
        currency,
        receipt,
        registrationId,
      })
      return res.data
    } catch (err) {
      throw toPaymentError(err)
    }
  },

  async openCheckout(orderData, userInfo = {}) {
    await razorpayProvider.loadScript()

    return razorpayProvider.openCheckout({
      key: orderData.key,
      order_id: orderData.orderId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Marathon Events',
      description: orderData.userName ? `${orderData.userName} — ${orderData.receipt}` : undefined,
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: userInfo.phone,
      },
      theme: {
        color: '#2563eb',
      },
    })
  },

  async verifyPayment({ razorpay_payment_id, razorpay_order_id, razorpay_signature, registrationId }) {
    try {
      const res = await api.post('/payments/verify', {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        registrationId,
      })
      return res.data
    } catch (err) {
      throw toPaymentError(err)
    }
  },

  async getUserPayments() {
    try {
      const res = await api.get('/payments/me')
      return res.data
    } catch (err) {
      throw toPaymentError(err)
    }
  },

  async processPayment({ registrationData, userInfo }) {
    const order = await this.createOrder(registrationData)

    const paymentResult = await this.openCheckout(order, userInfo)

    const verification = await this.verifyPayment({
      razorpay_payment_id: paymentResult.razorpay_payment_id,
      razorpay_order_id: paymentResult.razorpay_order_id,
      razorpay_signature: paymentResult.razorpay_signature,
      registrationId: registrationData.registrationId,
    })

    return verification
  },
}
