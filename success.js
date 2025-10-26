import { useRouter } from 'next/router';

export default function Success() {
  const router = useRouter();
  const { order_id } = router.query;

  return (
    <div className="container">
      <div className="card">
        <h2>نجاح الدفع / Payment success ✅</h2>
        <p>الطلب: {order_id || '—'}</p>
        <p>شكراً. If the item is digital you will receive a download link via email or your account.</p>
      </div>
    </div>
  );
}
