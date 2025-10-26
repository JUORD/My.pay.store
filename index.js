import { useState } from 'react';

export default function Home() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleBuy(method) {
    if (!amount || Number(amount) <= 0) {
      alert('أدخل مبلغًا صالحًا / Enter a valid amount.');
      return;
    }
    setLoading(true);
    try {
      const body = {
        orderId: `order-${Date.now()}`,
        amount: Number(amount),
        currency,
        description,
        method // 'nowpayments' or 'payeer'
      };
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (json.error) {
        alert('Error: ' + json.error);
        console.error(json);
      } else if (json.html) {
        const w = window.open('', '_blank');
        w.document.write(json.html);
      } else if (json.invoice_url || json.url) {
        const url = json.invoice_url || json.url;
        window.open(url, '_blank');
      } else {
        alert('No payment link returned. See console.');
        console.log(json);
      }
    } catch (e) {
      console.error(e);
      alert('Network or server error.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="card">
        <h1>متجر الدفع — Payment Store</h1>

        <div style={{ marginTop:12 }}>
          <label>
            المبلغ / Amount:
            <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="مثال: 5.00" />
          </label>
        </div>

        <div style={{ marginTop:12 }}>
          <label>
            الوصف / Description:
            <input type="text" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="مثال: منتج رقمي" style={{ width:'60%' }} />
          </label>
        </div>

        <div style={{ marginTop:12 }}>
          <label>
            العملة / Currency:
            <select value={currency} onChange={(e)=>setCurrency(e.target.value)}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </label>
        </div>

        <div style={{ marginTop:16, display:'flex', gap:10 }}>
          <button onClick={()=>handleBuy('nowpayments')} disabled={loading}>NOWPayments — بطاقة / Crypto</button>
          <button onClick={()=>handleBuy('payeer')} disabled={loading}>Payeer — بطاقة / محفظة</button>
        </div>

        <p style={{ marginTop:12, color:'#555' }}>
          بعد الدفع ستصل رسالة تأكيد أو تُعاد إلى صفحة النجاح. لا نتعامل مع بيانات البطاقة مباشرة — المعالجة عبر مزود الدفع.
        </p>
      </div>
    </main>
  );
}
