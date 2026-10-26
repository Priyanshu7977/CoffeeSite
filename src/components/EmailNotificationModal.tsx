import React from 'react';
import { X, Mail, CheckCircle2, Shield } from 'lucide-react';
import type { AutomatedEmail } from '../utils/emailService';

interface EmailNotificationModalProps {
  email: AutomatedEmail | null;
  onClose: () => void;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({ email, onClose }) => {
  if (!email) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2D2926]/60 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Email Simulation Window */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-white border border-[#2D2926]/10 p-5 sm:p-7 shadow-2xl text-[#2D2926] max-h-[88vh] overflow-y-auto">
        {/* Email Header Bar */}
        <div className="flex items-start sm:items-center justify-between border-b border-[#2D2926]/10 pb-3.5 mb-4 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center text-[#E05A7E] shrink-0 shadow-sm">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-[#E05A7E]">
                  DISPATCH NOTIFICATION
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[8px] font-mono text-emerald-700 font-bold">
                  <CheckCircle2 className="h-2.5 w-2.5" /> DELIVERED
                </span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold text-[#2D2926] leading-tight">
                {email.subject}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#2D2926]/10 bg-[#FAF7F5] text-[#5E5854] hover:text-[#2D2926] transition-all cursor-pointer shrink-0 mt-1 sm:mt-0 shadow-sm"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Email Metadata */}
        <div className="rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 p-3 mb-4 space-y-1 text-xs text-[#5E5854]">
          <div className="flex justify-between flex-wrap gap-1">
            <span className="text-[#8C827A]">From:</span>
            <span className="font-mono text-[#2D2926] font-bold">atelier@noirroast.com (NOIR DAKSHIN)</span>
          </div>
          <div className="flex justify-between flex-wrap gap-1">
            <span className="text-[#8C827A]">To:</span>
            <span className="font-mono text-[#2D2926] font-semibold">{email.recipientName} &lt;{email.to}&gt;</span>
          </div>
          <div className="flex justify-between flex-wrap gap-1">
            <span className="text-[#8C827A]">Date:</span>
            <span className="font-mono text-[#8C827A]">{new Date(email.timestamp).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* HTML Email Body */}
        <div className="rounded-2xl bg-[#F3ECE7] border border-[#2D2926]/10 p-5 sm:p-6 space-y-4">
          <div className="text-center pb-3 border-b border-[#2D2926]/10">
            <h2 className="font-display text-xl font-bold tracking-[0.25em] text-[#2D2926] uppercase">
              NOIR DAKSHIN
            </h2>
            <span className="text-[8px] font-mono text-[#E05A7E] uppercase tracking-widest block mt-0.5 font-bold">
              CHIKMAGALUR & BENGALURU • EST. 1998
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs text-[#5E5854] leading-relaxed">
            <p className="font-bold text-[#2D2926]">Salutations {email.recipientName},</p>
            {email.type === 'order_confirmation' ? (
              <>
                <p>
                  Your order <strong>#{email.details.orderNumber}</strong> has been logged into our cast-iron roasting ledger.
                </p>
                <p>
                  Each batch is hand-weighed, nitrogen-sealed, and dispatched from Chikmagalur directly to your address.
                </p>

                {email.details.items && (
                  <div className="rounded-xl bg-white border border-[#2D2926]/10 p-3.5 space-y-2 mt-2">
                    <span className="text-[9px] font-sans uppercase text-[#E05A7E] block tracking-widest font-bold">
                      RESERVED MICRO-LOT SELECTION
                    </span>
                    {email.details.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs pb-1.5 border-b border-[#2D2926]/10 last:border-b-0 last:pb-0">
                        <div>
                          <span className="font-display font-bold text-[#2D2926] block">{it.name}</span>
                          <span className="text-[10px] text-[#E05A7E]">{it.origin} • {it.grind} • Qty: {it.quantity}</span>
                        </div>
                        <span className="font-display text-[#2D2926] font-bold">{it.price}</span>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between items-center text-xs font-bold border-t border-[#2D2926]/10">
                      <span className="text-[#2D2926]">Total Settled:</span>
                      <span className="font-display text-sm text-[#2D2926] font-bold">{email.details.totalAmount}</span>
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-white border border-[#2D2926]/10 p-2.5 text-xs flex justify-between flex-wrap gap-1">
                  <span className="text-[#8C827A]">Delivery Address:</span>
                  <span className="text-[#2D2926] font-semibold">{email.details.shippingAddress}</span>
                </div>
              </>
            ) : (
              <>
                <p>
                  Welcome to the <strong>Noir Dakshin Private Cellar</strong>. You hold priority allocation rights to our seasonal harvest releases.
                </p>
                <div className="rounded-xl bg-white border border-[#2D2926]/10 p-3.5 text-center space-y-1">
                  <span className="text-[10px] font-sans tracking-widest text-[#E05A7E] uppercase block font-bold">
                    YOUR CELLAR PASSPORT NUMBER
                  </span>
                  <span className="font-mono text-lg font-bold text-[#2D2926] tracking-wider block">
                    #{email.details.membershipId}
                  </span>
                </div>
              </>
            )}

            <p className="pt-1 text-xs text-[#E05A7E] italic font-medium">
              “Crafted with care. Poured with purpose.”
            </p>
          </div>

          <div className="pt-3 border-t border-[#2D2926]/10 flex items-center justify-between text-[10px] font-mono text-[#8C827A]">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-[#E05A7E]" />
              <span>NOIR DAKSHIN HAUTE MAISON</span>
            </div>
            <span>OFFICIAL DISPATCH</span>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#2D2926] text-white font-sans text-xs font-bold uppercase transition-all cursor-pointer shadow-sm hover:bg-[#1F1C1A]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
