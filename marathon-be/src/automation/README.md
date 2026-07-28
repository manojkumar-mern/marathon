# n8n Automation

This module provides a lightweight bridge between the STRIDEFORGE backend and
[n8n](https://n8n.io) workflows via outgoing webhooks.

## How it works

1. Set `N8N_WEBHOOK_URL` in your `.env` (see `.env.example`).
2. Import the `n8n` service anywhere in the backend.
3. Call the appropriate method whenever an event occurs.

The service fires a POST request to `{N8N_WEBHOOK_URL}/{endpoint}` with a JSON
payload. If n8n is unreachable, the call fails silently — the main application
never crashes.

## Available methods

| Method                    | Endpoint       | Event constant        | Trigger                         |
|---------------------------|----------------|-----------------------|---------------------------------|
| `n8n.sendRegistration()`  | `/registration`| `REGISTRATION_SUCCESS`| New registration confirmed      |
| `n8n.sendPaymentSuccess()`| `/payment`     | `PAYMENT_SUCCESS`     | Payment completed               |
| `n8n.sendCertificate()`   | `/certificate` | `CERTIFICATE_READY`   | Certificate generated           |
| `n8n.sendMarketingCampaign()` | `/marketing` | `MARKETING_CAMPAIGN`  | Broadcast / campaign dispatch   |

## Payload shape

Every payload has this envelope:

```json
{
  "event": "PAYMENT_SUCCESS",
  "timestamp": "2026-07-28T12:00:00.000Z",
  "data": { }
}
```

The `data` object contains the domain-specific fields. Sample payloads for
each event are in the `templates/` folder.

## Adding a new webhook

1. Add a new event name to `automation.constants.js`.
2. Add a new method to the `n8n` object in `n8n.service.js`.
3. Call it from the relevant service or controller.

## Usage example

```js
import { n8n } from "../automation/n8n.service.js";

await n8n.sendPaymentSuccess({
  transactionId: "TXN-ABC123",
  registrationNumber: "REG-2026-00042",
  amount: 1499,
  currency: "INR",
  method: "razorpay",
});
```

## Environment variable

```
N8N_WEBHOOK_URL=https://your-n8n.example.com/webhook/stridforge
```

Leave empty to disable all n8n automation without code changes.
