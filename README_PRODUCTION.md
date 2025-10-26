# my-pay-store — Production notes

Project prepared as requested. Sensitive values must be set in environment variables (Vercel settings).

## Required environment variables (set in Vercel)
- NOWPAYMENTS_API_KEY
- PAYEER_SHOP_ID
- PAYEER_SECRET_KEY
- BASE_URL (e.g. https://your-project.vercel.app)

## Security (important)
1. Always use HTTPS (Vercel uses HTTPS by default).
2. Keep secret keys only in Vercel env variables; never commit them to Git.
3. Verify webhook signatures:
   - NOWPayments: check the `x-nowpayments-signature` header or signature field as their docs specify.
   - Payeer: verify `m_sign` using the official algorithm in their Merchant docs.
4. Use proper database (Postgres, MongoDB, Supabase) instead of file storage for orders.
5. Rate-limit your webhooks/endpoints and use IP whitelist if provided by provider.
6. For card security: card data is never handled by your server in this design — payments go to the payment provider (PCI scope handled by provider).
7. If you are under 18, a legal guardian must help with account verification/KYC and card issuance.

## Next steps
1. Replace placeholder keys in Vercel.
2. Implement Payeer signature exactly as in their docs (marked TODO in lib/payeer.js).
3. Test with small amounts.
4. Replace file-based orders with a proper DB and add email delivery for digital goods.
