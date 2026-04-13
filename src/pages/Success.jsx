import React from 'react';
import storeConfig from '../data/storeConfig';

const { payment: PAY } = storeConfig;

const paymentNotes = {
  opay: `💚 Please complete your OPay transfer to finalise your order:\nBank: ${PAY.bankName}\nAccount Name: ${PAY.accountName}\nAccount Number: ${PAY.accountNumber}\n\nSend payment proof + your order number to WhatsApp: ${PAY.whatsapp}`,
  bank: `🏦 Please complete your bank transfer:\nBank: ${PAY.bankName}\nAccount Name: ${PAY.accountName}\nAccount Number: ${PAY.accountNumber}\n\nSend proof to WhatsApp: ${PAY.whatsapp}`,
  ussd: `📱 Complete your USSD payment to ${PAY.bankName} — ${PAY.accountNumber} (${PAY.accountName})\n\nThen send proof to WhatsApp: ${PAY.whatsapp}`,
  pod: `💵 Pay on Delivery confirmed!\nHave the exact amount ready in cash when your order arrives. Our delivery agent will collect payment at your door.`,
};

export default function Success({ orderId, setPage }) {
  const note = paymentNotes[orderId?.payment] || paymentNotes.opay;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: 24 }}>
      <div style={{
        background: 'white', borderRadius: 'var(--radius-lg)',
        padding: '48px 36px', maxWidth: 520, width: '100%',
        textAlign: 'center', boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--green-dark)', marginBottom: 10 }}>Order Placed!</h2>
        <p style={{ color: 'var(--text-mid)', marginBottom: 6 }}>
          Thank you for shopping with <strong>J'manel Superstores!</strong>
        </p>
        <p style={{ color: 'var(--text-mid)', marginBottom: 16 }}>
          Your order has been received and is being processed.
        </p>

        <div style={{
          background: 'var(--yellow-light)', borderRadius: 10,
          padding: '10px 20px', display: 'inline-block',
          fontWeight: 700, color: 'var(--green-dark)',
          margin: '14px 0', fontSize: '1.1rem',
        }}>
          Order #{orderId?.id}
        </div>

        <div style={{
          background: 'var(--green-pale)', border: '1px solid #a8d5b5',
          borderRadius: 12, padding: 16, margin: '16px 0',
          fontSize: '0.86rem', lineHeight: 1.8,
          textAlign: 'left', whiteSpace: 'pre-line',
        }}>
          {note}
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-light)', marginBottom: 20 }}>
          For enquiries call or WhatsApp: <strong>{storeConfig.whatsapp}</strong>
        </p>

        <button
          onClick={() => setPage('shop')}
          style={{
            background: 'var(--green-dark)', color: 'white',
            border: 'none', borderRadius: 12, padding: '12px 28px',
            fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
