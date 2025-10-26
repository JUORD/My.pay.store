export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // IMPORTANT: verify signature/header according to NOWPayments docs
  const payload = req.body;
  console.log('NOWPayments webhook payload:', payload);

  const orderId = payload.order_id || payload.orderId;
  const payment_status = payload.payment_status || payload.status || payload.payment_status;

  if (orderId && (payment_status === 'finished' || payment_status === 'confirmed')) {
    console.log(`Order ${orderId} marked as paid (NOWPayments).`);
    // TODO: mark order as paid in DB and deliver product
  }

  return res.status(200).json({ ok: true });
}
