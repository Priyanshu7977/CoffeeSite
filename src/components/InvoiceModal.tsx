import React from 'react';
import { X, Printer, Coffee } from 'lucide-react';
import type { CustomerOrder } from '../types/payment';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CustomerOrder | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen || !order) return null;

  const invoiceNumber = `INV-${new Date(order.createdAt).getFullYear()}-${order.orderNumber.replace(/[^0-9]/g, '').slice(-5) || '1998'}`;
  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  // Convert total to words
  const formatAmountWords = (num: number): string => {
    // Basic friendly converter for specialty coffee amounts
    const thousands = Math.floor(num / 1000);
    const hundreds = Math.floor((num % 1000) / 100);
    const rem = num % 100;
    let text = '';
    if (thousands > 0) text += `${thousands} Thousand `;
    if (hundreds > 0) text += `${hundreds} Hundred `;
    if (rem > 0) text += `${rem} `;
    return `${text.trim()} Rupees Only`;
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2D2926]/75 backdrop-blur-md transition-opacity duration-300 print:hidden"
      />

      {/* Invoice Card */}
      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-white border border-[#2D2926]/10 p-6 sm:p-10 shadow-2xl text-[#2D2926] max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0 print:border-none print:rounded-none">
        
        {/* Top Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E05A7E]">
            <Printer className="h-4 w-4" />
            <span>OFFICIAL ROASTERY TAX INVOICE</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D2926] text-white text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Printer className="h-3.5 w-3.5 text-[#F5DADF]" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2D2926]/10 bg-[#FAF7F5] text-[#5E5854] hover:text-[#2D2926] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================= INVOICE PRINT AREA ================= */}
        <div id="invoice-printable" className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-[#2D2926] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-[#2D2926] text-white">
                  <span className="font-display text-sm font-bold">N</span>
                </div>
                <h1 className="font-display font-bold text-xl sm:text-2xl tracking-wider text-[#2D2926]">
                  NOIR DAKSHIN COFFEE
                </h1>
              </div>
              <p className="text-xs text-[#5E5854] max-w-sm leading-relaxed">
                Specialty Shade-Grown Single-Estate Coffee Roasters.<br />
                Plot 42, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038<br />
                <span className="font-mono text-[11px] text-[#8C827A]">GSTIN: 29AAACN1998K1Z5 • FSSAI Lic: 11226334000199</span>
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-[#F5DADF] text-[#2D2926] font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5">
                TAX INVOICE
              </span>
              <div className="font-mono font-bold text-sm text-[#2D2926]">{invoiceNumber}</div>
              <div className="text-xs text-[#8C827A] font-mono">Date: {invoiceDate}</div>
              <div className="text-xs text-[#8C827A] font-mono">Order Ref: #{order.orderNumber}</div>
            </div>
          </div>

          {/* Customer & Shipping Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block mb-1">
                BILLED & SHIPPED TO:
              </span>
              <p className="font-display font-bold text-sm text-[#2D2926]">{order.customerName}</p>
              <p className="text-[#5E5854] mt-0.5">{order.shippingAddress.address}</p>
              <p className="text-[#5E5854]">{order.shippingAddress.city} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
              <p className="font-mono text-[#8C827A] mt-1">Phone: {order.customerPhone}</p>
              <p className="font-mono text-[#8C827A]">Email: {order.customerEmail}</p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block mb-1">
                DISPATCH & PAYMENT TELEMETRY:
              </span>
              <div className="flex justify-between">
                <span className="text-[#8C827A]">Payment Gateway:</span>
                <span className="font-mono font-bold uppercase text-[#2D2926]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C827A]">Payment Status:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {order.paymentStatus === 'captured' ? 'PAID & CLEARED' : order.paymentStatus.toUpperCase()}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="text-[#8C827A]">Razorpay Txn ID:</span>
                  <span className="font-mono text-[#2D2926]">{order.razorpayPaymentId}</span>
                </div>
              )}
              {order.utrNumber && (
                <div className="flex justify-between">
                  <span className="text-[#8C827A]">UPI UTR Ref:</span>
                  <span className="font-mono text-[#C89658] font-bold">{order.utrNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#8C827A]">Logistics Carrier:</span>
                <span className="font-mono text-[#2D2926]">Blue Dart Air Express</span>
              </div>
            </div>
          </div>

          {/* Table of Coffee Items */}
          <div className="border border-[#2D2926]/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#2D2926] text-white font-mono text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Single-Origin Lot Description</th>
                  <th className="py-2.5 px-3">Grind Spec</th>
                  <th className="py-2.5 px-3">HSN Code</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D2926]/10">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF7F5]/60">
                    <td className="py-3 px-3 font-mono text-[#8C827A]">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="font-display font-bold text-[#2D2926]">{item.name}</span>
                      <span className="block text-[10px] font-mono text-[#8C827A]">250g Nitrogen-Sealed Tin</span>
                    </td>
                    <td className="py-3 px-3 text-[#5E5854] font-mono text-[11px]">{item.grind}</td>
                    <td className="py-3 px-3 text-[#8C827A] font-mono text-[11px]">090121</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-[#2D2926]">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono text-[#5E5854]">₹{item.unitPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#2D2926]">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals and GST Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
            <div className="space-y-2 max-w-sm text-xs text-[#5E5854]">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block">
                AMOUNT IN WORDS
              </span>
              <p className="font-serif italic text-sm text-[#2D2926] font-medium bg-[#FAF7F5] p-2.5 rounded-xl border border-[#2D2926]/10">
                {formatAmountWords(order.pricing.finalTotal)}
              </p>

              <div className="pt-2 text-[10.5px] leading-relaxed text-[#8C827A]">
                <p><strong>Tax Summary:</strong> Prices include 5% GST (2.5% CGST + 2.5% SGST for Karnataka; 5% IGST for interstate deliveries).</p>
                <p>This is a computer-generated tax invoice and requires no physical ink signature.</p>
              </div>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-[#5E5854]">
                <span>Taxable Subtotal:</span>
                <span className="font-mono font-semibold text-[#2D2926]">₹{order.pricing.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {order.pricing.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Voucher Discount ({order.pricing.discountCode}):</span>
                  <span className="font-mono font-bold">-₹{order.pricing.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-[#5E5854]">
                <span>Express Doorstep Courier:</span>
                <span className="font-mono font-bold text-emerald-700">FREE</span>
              </div>

              <div className="flex justify-between pt-2.5 border-t-2 border-[#2D2926] text-base font-display font-bold text-[#2D2926]">
                <span>Total Invoice Value:</span>
                <span className="font-mono text-xl">₹{order.pricing.finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer Certified Badge & Guarantee */}
          <div className="pt-6 border-t border-[#2D2926]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#2D2926] text-[#C89658] flex items-center justify-center shrink-0">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <span className="font-display font-bold text-[#2D2926] block">Single-Estate Authenticity Certified</span>
                <span className="text-[11px] text-[#8C827A]">Western Ghats Shade-Grown Arabica • Zero Chicory Guaranteed</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-[#8C827A] block font-bold">Authorized Signatory</span>
              <span className="font-display font-bold text-sm text-[#2D2926]">Priyanshu Singh</span>
              <span className="text-[10px] text-[#8C827A] block">Head Roaster • Noir Dakshin Coffee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
