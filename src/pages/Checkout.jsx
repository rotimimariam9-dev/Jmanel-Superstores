import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import storeConfig from '../data/storeConfig';

const { delivery: DC, vatRate, payment: PAY } = storeConfig;

const PAYMENT_METHODS = [
  { key: 'opay', icon: '🟢', label: 'OPay Transfer', sub: 'Instant transfer' },
  { key: 'bank', icon: '🏦', label: 'Bank Transfer', sub: 'Any Nigerian bank' },
  { key: 'ussd', icon: '📱', label: 'USSD Payment', sub: 'Dial from your phone' },
  { key: 'pod',  icon: '💵', label: 'Pay on Delivery', sub: 'Cash at doorstep' },
];

const STATES = ['Lagos','Abuja','Rivers','Ogun','Oyo','Kano','Kaduna','Enugu','Anambra','Delta','Edo','Imo','Kwara','Osun','Ekiti','Ondo','Cross River','Akwa Ibom','Benue','Other'];

function PaymentInfo({ method }) {
  const base = { borderRadius: 12, padding: '14px 16px', fontSize: '0.85rem', lineHeight: 1.8, marginTop: 14 };
  const boxes = {
    opay: { style: { ...base, background: '#e8f5e9', border: '1px solid #a8d5b5' }, content: <><strong>💚 OPay Transfer Details</strong><br />Bank: <strong>{PAY.bankName}</strong><br />Account Name: <strong>{PAY.accountName}</strong><br />Account Number: <strong>{PAY.accountNumber}</strong><br /><br />Send receipt to WhatsApp: <strong>📲 {PAY.whatsapp}</strong><br /><em style={{ color: 'var(--text-mid)' }}>Include your order reference.</em></> },
    bank: { style: { ...base, background: '#e8f5e9', border: '1px solid #a8d5b5' }, content: <><strong>🏦 Bank Transfer</strong><br />Bank: <strong>{PAY.bankName}</strong><br />Account Name: <strong>{PAY.accountName}</strong><br />Account Number: <strong>{PAY.accountNumber}</strong><br />Send proof to WhatsApp: <strong>📲 {PAY.whatsapp}</strong></> },
    ussd: { style: { ...base, background: '#fff3e0', border: '1px solid #ffcc80' }, content: <><strong>📱 USSD Transfer</strong><br />Transfer to <strong>{PAY.bankName} — {PAY.accountNumber}</strong><br /><br /><strong>GTBank:</strong> *737*1*Amount*0058*AccNum#<br /><strong>Access:</strong> *901*Amount*AccNum#<br /><strong>Zenith:</strong> *966*Amount*AccNum#<br /><strong>UBA:</strong> *919*3*AccNum*Amount#<br /><strong>First Bank:</strong> *894*Amount*AccNum#<br /><strong>OPay:</strong> *955*AccNum*Amount#<br /><br />Send proof to: <strong>📲 {PAY.whatsapp}</strong></> },
    pod: { style: { ...base, background: 'var(--yellow-light)', border: '1px solid var(--yellow)' }, content: <><strong>💵 Pay on Delivery</strong><br />✅ Available within Lagos only.<br />✅ Have exact cash ready at delivery.<br />✅ ₦{DC.podHandlingFee.toLocaleString()} handling fee added to total.</> },
  };
  const current = boxes[method];
  if (!current) return null;
  return <div style={current.style}>{current.content}</div>;
}

export default function Checkout({ setPage,
