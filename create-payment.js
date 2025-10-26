import { createNowPaymentInvoice } from '../../lib/nowpayments';
import { buildPayeerForm } from '../../lib/payeer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId, amount, currency, description, method } = req.body;

  if (!orderId || !amount || !currency) {
    return res.status(400).json({ error: 'missing parameters' });
  }

  try {
    if (method === 'nowpayments') {
      const invoice = await createNowPaymentInvoice({
        price_amount: amount,
        price_currency: currency,
        order_id: orderId,
        order_description: description
      });
      return res.status(200).json(invoice);
    }

    if (method === 'payeer') {
      const html = buildPayeerForm({
        orderId,
        amount,
        currency,
        description
      });
      return res.status(200).json({ html });
    }

    return res.status(400).json({ error: 'unsupported method' });
  } catch (err) {
    console.error('create-payment error', err);
    return res.status(500).json({ error: 'server error' });
  }
}
