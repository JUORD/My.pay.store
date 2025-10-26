import fetch from 'node-fetch';

export async function createNowPaymentInvoice({ price_amount, price_currency = 'USD', order_id, order_description }) {
  const NOW_API_KEY = process.env.NOWPAYMENTS_API_KEY;
  if (!NOW_API_KEY) throw new Error('NOWPAYMENTS_API_KEY not set');

  const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

  const body = {
    price_amount: Number(price_amount),
    price_currency,
    pay_currency: 'usd',
    order_id,
    order_description,
    ipn_callback_url: `${BASE_URL}/api/nowpayments-webhook`,
    success_url: `${BASE_URL}/success?order_id=${encodeURIComponent(order_id)}`,
    cancel_url: `${BASE_URL}/cancel?order_id=${encodeURIComponent(order_id)}`
  };

  const resp = await fetch('https://api.nowpayments.io/v1/invoice', {
    method: 'POST',
    headers: {
      'x-api-key': NOW_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error('NOWPayments API error: ' + txt);
  }

  const json = await resp.json();
  return json;
}
