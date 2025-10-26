import crypto from 'crypto';

const PAYEER_SHOP_ID = process.env.PAYEER_SHOP_ID;
const PAYEER_SECRET_KEY = process.env.PAYEER_SECRET_KEY;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

if (!PAYEER_SHOP_ID || !PAYEER_SECRET_KEY) {
  console.warn('Payeer config not set. Set PAYEER_SHOP_ID and PAYEER_SECRET_KEY in env.');
}

function generateSign(params) {
  // ===== IMPORTANT =====
  // Replace this placeholder with Payeer's exact m_sign algorithm from official docs.
  const toSign = [
    params.m_shop,
    params.m_orderid,
    params.m_amount,
    params.m_curr,
    params.m_desc
  ].join(':') + ':' + PAYEER_SECRET_KEY;

  return crypto.createHash('md5').update(toSign).digest('hex');
}

export function buildPayeerForm({ orderId, amount, currency = 'USD', description = '' }) {
  const params = {
    m_shop: PAYEER_SHOP_ID,
    m_orderid: orderId,
    m_amount: Number(amount).toFixed(2),
    m_curr: currency,
    m_desc: Buffer.from(description).toString('base64'),
    m_success_url: `${BASE_URL}/success?order_id=${encodeURIComponent(orderId)}`,
    m_fail_url: `${BASE_URL}/cancel?order_id=${encodeURIComponent(orderId)}`,
    m_status_url: `${BASE_URL}/api/payeer-webhook`
  };

  params.m_sign = generateSign(params);

  let inputs = '';
  for (const k in params) {
    inputs += `<input type="hidden" name="${k}" value="${params[k]}"/>`;
  }

  return `<!doctype html><html><body onload="document.forms[0].submit()">
    <form method="POST" action="https://payeer.com/merchant/">
      ${inputs}
    </form>
    <p>Redirecting to Payeer...</p>
  </body></html>`;
}
