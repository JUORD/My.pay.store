export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const body = req.body;
  console.log('Payeer webhook body:', body);

  // TODO: verify m_sign according to Payeer docs using PAYEER_SECRET_KEY

  const orderId = body.m_orderid;
  const status = body.m_status;

  if (orderId && (status === 'success' || status === '1')) {
    console.log(`Payeer: order ${orderId} paid`);
    // TODO: mark order as paid in DB and deliver product
  }

  return res.status(200).send('OK');
}
