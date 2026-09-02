import React from 'react';
import { X, Mail, CheckCircle2 } from 'lucide-react';
import type { AutomatedEmail } from '../utils/emailService';

interface EmailNotificationModalProps {
  email: AutomatedEmail | null;
  onClose: () => void;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({ email, onClose }) => {
  if (!email) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#070605]/85 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Luxury Email Client Simulation Window */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl bg-[#0e0b08] border border-[#c89658]/40 p-6 sm:p-8 shadow-[0_25px_90px_rgba(0,0,0,0.95)] text-[#f4eee6] max-h-[90vh] overflow-y-auto">
        {/* Email Header Bar */}
        <div className="flex items-center justify-between border-b border-[#2b2118] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#18120d] border border-[#c89658]/50 flex items-center justify-center text-[#c89658] shadow-[0_0_15px_rgba(200,150,88,0.25)]">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#c89658]">
                  AUTOMATED DISPATCH SIMULATOR
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.2 text-[9px] font-mono text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> SENT
                </span>
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#f4eee6]">
                {email.subject}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#2b221a] bg-[#14100c] text-[#8c827a] hover:border-[#c89658] hover:text-[#f4eee6] transition-all cursor-pointer shrink-0"
            aria-label="Close Email Preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Email Metadata */}
        <div className="rounded-2xl bg-[#140f0c] border border-[#241c15] p-4 mb-6 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-[#8c827a]">From:</span>
            <span className="font-mono text-[#e5b877]">atelier@noirroast.com (Maison Noir Dispatch Robot)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8c827a]">To:</span>
            <span className="font-mono text-[#f4eee6]">{email.recipientName} &lt;{email.to}&gt;</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8c827a]">Timestamp:</span>
            <span className="font-mono text-[#8c827a]">{new Date(email.timestamp).toLocaleString()}</span>
          </div>
        </div>

        {/* Realistic HTML Email Content Body */}
        <div className="rounded-2xl bg-[#090705] border border-[#33261a] p-6 sm:p-8 space-y-6">
          {/* Email Brand Seal */}
          <div className="text-center pb-4 border-b border-[#211a14]">
            <span className="text-[10px] font-sans tracking-[0.35em] text-[#c89658] uppercase block mb-1">
              HAUTE ROASTERY MAISON EST. 1998
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#f4eee6] uppercase drop-shadow-[0_0_20px_rgba(200,150,88,0.4)]">
              NOIR ROAST
            </h2>
            <span className="text-[9px] font-mono text-[#8c827a] uppercase tracking-widest block mt-1">
              KYOTO ATELIER • ZURICH CELLARS • NEW YORK VAULT
            </span>
          </div>

          {/* Greeting & Body text */}
          <div className="space-y-3 font-sans text-xs sm:text-sm text-[#cfc5ba] leading-relaxed">
            <p>Dear {email.recipientName},</p>
            {email.type === 'order_confirmation' ? (
              <>
                <p>
                  Thank you for securing your allocation with NOIR ROAST. Your order <strong>#{email.details.orderNumber}</strong> has been logged into our cast-iron roasting batch ledger.
                </p>
                <p>
                  Each micro-tin is being hand-weighed, flushed with inert nitrogen, and stamped with our master roaster wax seal before release to our white-glove courier.
                </p>

                {/* Items Breakdown */}
                {email.details.items && (
                  <div className="rounded-xl bg-[#120e0b] border border-[#261f19] p-4 space-y-3 mt-4">
                    <span className="text-[10px] font-mono uppercase text-[#c89658] block tracking-widest font-bold">
                      ALLOCATION MANIFEST
                    </span>
                    {email.details.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs pb-2 border-b border-[#1c1611] last:border-b-0 last:pb-0">
                        <div>
                          <span className="font-serif font-bold text-[#f4eee6] block">{it.name}</span>
                          <span className="text-[10px] text-[#8c827a]">{it.origin} • Grind: {it.grind} • Qty: {it.quantity}</span>
                        </div>
                        <span className="font-mono font-bold text-[#e5b877]">{it.price}</span>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between items-center text-xs font-bold border-t border-[#261f19]">
                      <span className="text-[#f4eee6]">Total Settled:</span>
                      <span className="font-mono text-[#e5b877] text-sm">{email.details.totalAmount}</span>
                    </div>
                  </div>
                )}

                {/* Shipping info */}
                <div className="rounded-xl bg-[#120e0b] border border-[#261f19] p-3 text-xs flex items-center justify-between">
                  <span className="text-[#8c827a]">Dispatch Address:</span>
                  <span className="font-mono text-[#f4eee6]">{email.details.shippingAddress}</span>
                </div>
              </>
            ) : (
              <>
                <p>
                  We are pleased to welcome you to the <strong>Noir Vault Allocation Circle</strong>. Your credentials have been authenticated for limited private harvest lots.
                </p>
                <div className="rounded-xl bg-[#120e0b] border border-[#c89658]/40 p-4 text-center space-y-2">
                  <span className="text-[10px] font-sans tracking-[0.25em] text-[#c89658] uppercase block font-semibold">
                    YOUR VIP VAULT PASSCODE
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#e5b877] tracking-widest block">
                    #{email.details.membershipId}
                  </span>
                  <span className="text-[10px] font-sans text-[#8c827a] block">
                    Priority access to all 12kg single-ridge numbered roasts.
                  </span>
                </div>
              </>
            )}

            <p className="pt-2 text-xs text-[#8c827a] italic">
              "We do not mass produce. We do not rush. We do not compromise."
            </p>
          </div>

          {/* Email Footer */}
          <div className="pt-4 border-t border-[#211a14] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-[#6e6358]">
            <span>NOIR ROAST MAISON DE HAUTE TORRÉFACTION</span>
            <span>SECURE DISPATCH CONFIRMATION</span>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#c89658] text-[#070605] font-sans text-xs font-bold uppercase tracking-wider hover:bg-[#e5b877] transition-all cursor-pointer shadow-[0_0_15px_rgba(200,150,88,0.3)]"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
