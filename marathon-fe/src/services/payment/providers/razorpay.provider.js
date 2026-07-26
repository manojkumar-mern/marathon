import { SDK_LOAD_TIMEOUT, RAZORPAY_SDK_URL, ERROR_CODES } from '../payment.constants.js'

let loadPromise = null

async function loadScript() {
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${RAZORPAY_SDK_URL}"]`)
    if (existing && window.Razorpay) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = RAZORPAY_SDK_URL
    script.async = true

    const timeoutId = setTimeout(() => {
      script.remove()
      loadPromise = null
      reject({ code: ERROR_CODES.SDK_LOAD_TIMEOUT, message: 'Payment gateway SDK load timed out. Please check your connection and try again.' })
    }, SDK_LOAD_TIMEOUT)

    script.onload = () => {
      clearTimeout(timeoutId)
      if (!window.Razorpay) {
        loadPromise = null
        reject({ code: ERROR_CODES.SDK_LOAD_FAILED, message: 'Payment gateway SDK failed to initialise.' })
        return
      }
      resolve()
    }

    script.onerror = () => {
      clearTimeout(timeoutId)
      loadPromise = null
      reject({ code: ERROR_CODES.SDK_LOAD_FAILED, message: 'Failed to load payment gateway SDK. Please try again.' })
    }

    document.head.appendChild(script)
  })

  return loadPromise
}

/**
 * Opens Razorpay checkout modal
 * @param {import('../payment.types.js').RazorpayCheckoutOptions} options
 * @returns {Promise<{razorpay_payment_id: string, razorpay_order_id: string, razorpay_signature: string}>}
 */
function openCheckout(options) {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject({ code: ERROR_CODES.SDK_LOAD_FAILED, message: 'Payment gateway not loaded. Please try again.' })
      return
    }

    let resolved = false

    const razorpay = new window.Razorpay({
      key: options.key,
      order_id: options.order_id,
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      image: options.image,
      prefill: {
        name: options.prefill?.name,
        email: options.prefill?.email,
        contact: options.prefill?.contact,
      },
      theme: {
        color: options.theme?.color || '#2563eb',
        ...options.theme,
      },
      handler(response) {
        resolved = true
        resolve({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        })
      },
      modal: {
        ondismiss() {
          if (!resolved) {
            reject({ code: ERROR_CODES.PAYMENT_CANCELLED, message: 'Payment was cancelled.' })
          }
        },
      },
    })

    razorpay.on('payment.failed', (response) => {
      if (!resolved) {
        resolved = true
        reject({
          code: ERROR_CODES.PAYMENT_FAILED,
          message: response.error?.description || 'Payment failed. Please try again.',
          original: response.error,
        })
      }
    })

    razorpay.open()
  })
}

export const razorpayProvider = { loadScript, openCheckout }
