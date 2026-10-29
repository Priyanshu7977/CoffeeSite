import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Truck, 
  RotateCcw, 
  Lock, 
  Scale, 
  Mail,
  Phone
} from 'lucide-react';

export type LegalTabType = 'terms' | 'privacy' | 'shipping' | 'refund';

interface LegalPageProps {
  initialTab?: LegalTabType;
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'terms' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (): LegalTabType => {
    if (location.pathname.includes('privacy')) return 'privacy';
    if (location.pathname.includes('shipping')) return 'shipping';
    if (location.pathname.includes('refund') || location.pathname.includes('cancellation')) return 'refund';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState<LegalTabType>(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tab: LegalTabType) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pb-28 selection:bg-[#F5DADF] selection:text-[#2D2926]">
      {/* Sub-Header */}
      <div className="pt-[max(calc(env(safe-area-inset-top)+5.25rem),6.5rem)] sm:pt-28 md:pt-32 pb-3.5 sm:pb-4 px-4 sm:px-8 border-b border-[#2D2926]/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Return to Boutique</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#2D2926]">
              COMPLIANCE & CONSUMER RIGHTS
            </span>
          </div>

          <Link
            to="/contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2D2926] text-white text-xs font-bold hover:bg-black transition-colors"
          >
            <span>Roastery Desk</span>
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 sm:px-8 pt-10">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5DADF] text-[#2D2926] text-xs font-mono font-bold uppercase tracking-widest mb-3 shadow-2xs">
            <Scale className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>TRANSPARENCY & CONSUMER TRUST • EST. 1998</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#2D2926]">
            Policies, Terms & <span className="italic text-[#E05A7E]">Guarantees.</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#5E5854] mt-2.5 leading-relaxed">
            All single-estate micro-lots roasted by NOIR ROAST COFFEE are backed by unbending consumer rights, 
            256-bit encrypted transactions, and certified food safety compliance under Indian E-Commerce Regulations.
          </p>
        </div>

        {/* 4 Interactive Legal Tabs */}
        <div className="flex overflow-x-auto scrollbar-none gap-2 p-1.5 rounded-2xl bg-white border border-[#2D2926]/10 shadow-xs mb-8 max-w-3xl mx-auto">
          {[
            { id: 'terms', label: 'Terms & Conditions', icon: FileText },
            { id: 'privacy', label: 'Privacy Policy', icon: Lock },
            { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
            { id: 'refund', label: 'Refunds & Returns', icon: RotateCcw },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id as LegalTabType)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2D2926] text-white shadow-sm'
                    : 'text-[#5E5854] hover:text-[#2D2926] hover:bg-[#FAF7F5]'
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-[#2D2926]/10 p-6 sm:p-10 shadow-sm leading-relaxed text-[#5E5854] text-xs sm:text-sm space-y-8">
          
          {/* TAB 1: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#2D2926]/10 pb-4">
                <span className="text-[10px] font-mono text-[#E05A7E] font-bold uppercase tracking-widest block mb-1">
                  LEGAL AGREEMENT • UPDATED OCTOBER 2026
                </span>
                <h2 className="font-display text-2xl font-bold text-[#2D2926]">
                  Terms of Service & Commercial Conditions
                </h2>
              </div>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">1. Nature of the Roastery Boutique</h3>
                <p>
                  NOIR ROAST COFFEE operates an artisanal single-estate specialty coffee roasting house based in Bengaluru, Karnataka. By browsing this boutique, creating an account, or placing a coffee order, you agree to comply with and be bound by these terms.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">2. Harvest Allocations & Small-Batch Freshness</h3>
                <p>
                  Specialty micro-lots are shade-grown on specific family estates (Chikmagalur, Nilgiris, Coorg, Araku). Because our harvests are roasted fresh in weekly drum cycles, micro-lot inventories are strictly limited. In the event an allocation sells out before your order is processed, our roastery will contact you within 4 hours to offer an equivalent grand cru estate or a full instant refund.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">3. Pricing, Payments & Security</h3>
                <p>
                  All coffee prices on this boutique are displayed in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST). Payments are securely authenticated via Razorpay (supporting UPI, Credit/Debit cards, Net Banking) or verified direct UPI settlement. We do not store credit card or CVV details on our servers.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">4. Governing Jurisdiction</h3>
                <p>
                  Any dispute, claim, or controversy arising out of your purchases with NOIR ROAST COFFEE shall be governed by the laws of the Republic of India and subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#2D2926]/10 pb-4">
                <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-widest block mb-1">
                  DATA PRIVACY & 256-BIT ENCRYPTION
                </span>
                <h2 className="font-display text-2xl font-bold text-[#2D2926]">
                  Privacy Policy & Patron Security Pledge
                </h2>
              </div>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">1. Information We Collect</h3>
                <p>
                  We only gather information necessary to fulfill your fresh roast order: your name, contact phone number, shipping destination, and email address for dispatch alerts and tracking telemetry.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">2. Strict Zero-Spam & Zero-Selling Pledge</h3>
                <p>
                  We have never sold, rented, or monetized customer phone numbers or email addresses to commercial brokers, advertisers, or call centers. Your details are used strictly for roast batch hold notifications, tracking dispatch links, and verified roastery communication.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">3. Cryptographic Transmission Security</h3>
                <p>
                  Every transmission between your browser and our server is secured using high-grade 256-bit TLS/SSL encryption. Authentication signatures for Razorpay gateways and Firebase phone verifications are cryptographically verified using SHA-256 HMAC protocols.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">4. Your Right to Account Deletion</h3>
                <p>
                  You retain full ownership of your data. You may request complete erasure of your member profile and address records at any time by messaging founder Priyanshu Singh at <a href="mailto:priyanshubipin2006@gmail.com" className="text-[#E05A7E] font-mono hover:underline">priyanshubipin2006@gmail.com</a>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 3: SHIPPING & EXPRESS DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#2D2926]/10 pb-4">
                <span className="text-[10px] font-mono text-[#E05A7E] font-bold uppercase tracking-widest block mb-1">
                  EXPRESS LOGISTICS & PACKAGING INTEGRITY
                </span>
                <h2 className="font-display text-2xl font-bold text-[#2D2926]">
                  Shipping & Pan-India Delivery Policy
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 text-center">
                <div>
                  <span className="font-display text-xl font-bold text-[#2D2926] block">24–48 Hours</span>
                  <span className="text-[11px] font-mono text-[#8C827A] uppercase">Bengaluru & South Metros</span>
                </div>
                <div>
                  <span className="font-display text-xl font-bold text-[#E05A7E] block">2–3 Days</span>
                  <span className="text-[11px] font-mono text-[#8C827A] uppercase">Mumbai, Delhi, Pune, Hyd</span>
                </div>
                <div>
                  <span className="font-display text-xl font-bold text-[#2D2926] block">100% Free</span>
                  <span className="text-[11px] font-mono text-[#8C827A] uppercase">Express Shipping All India</span>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">1. Roasting & Dispatch Cycle</h3>
                <p>
                  All coffees are nitrogen-flushed and sealed within 24 hours of drum roasting. Orders placed before 1:00 PM IST Monday through Saturday are dispatched the very same evening via express air courier (Blue Dart, Delhivery, or DTDC Express).
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">2. Nitrogen-Flushed Tin Protection</h3>
                <p>
                  We do not use flimsy paper bags. Each 250g allocation is packaged in airtight, recyclable cylindrical tins equipped with one-way degassing valves to preserve aromatics and prevent ambient moisture oxidation during transit.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">3. Live AWB Tracking Telemetry</h3>
                <p>
                  Upon handover to our courier logistics fleet, an Air Waybill (AWB) tracking number is immediately assigned to your order. You can monitor your delivery real-time directly on our <Link to="/track" className="text-[#E05A7E] font-bold hover:underline">Live Order Tracking Portal</Link>.
                </p>
              </section>
            </div>
          )}

          {/* TAB 4: REFUND & CANCELLATIONS */}
          {activeTab === 'refund' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-[#2D2926]/10 pb-4">
                <span className="text-[10px] font-mono text-rose-700 font-bold uppercase tracking-widest block mb-1">
                  ROAST FRESHNESS & PERISHABLE GUARANTEE
                </span>
                <h2 className="font-display text-2xl font-bold text-[#2D2926]">
                  Cancellation, Return & Refund Policy
                </h2>
              </div>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">1. Perishable Food Item Policy</h3>
                <p>
                  Because roasted coffee beans are perishable agricultural goods calibrated to order (specific grinds tailored to your brew setup), opened tins cannot be physically returned once broken. However, we stand 100% behind the quality and freshness of our roast.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">2. Transit Damage & Defect Replacement</h3>
                <p>
                  If your package arrives with a broken tin seal, transit denting, or an incorrect grind specification, simply send a photo within 48 hours of delivery to our WhatsApp desk (+91 79776 41125). We will immediately dispatch a fresh replacement batch at zero cost to you, or issue a 100% full refund.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">3. Order Cancellation Before Dispatch</h3>
                <p>
                  You may cancel any unfulfilled order for a full instant refund within 2 hours of placement before our roasters begin drum convection. To cancel, visit your <Link to="/account" className="text-[#E05A7E] font-bold hover:underline">Member Account</Link> or WhatsApp our roastery desk directly.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-display font-bold text-base text-[#2D2926]">4. Refund Settlement Timeline</h3>
                <p>
                  Approved refunds processed through Razorpay UPI or Cards are credited back to your original source account within 3 to 5 business days, in compliance with Reserve Bank of India (RBI) payment clearing guidelines.
                </p>
              </section>
            </div>
          )}

          {/* Roastery Direct Contact Information */}
          <div className="p-6 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block">
                COMPLIANCE & GRIEVANCE OFFICER
              </span>
              <h4 className="font-display font-bold text-base text-[#2D2926]">
                Priyanshu Singh (Founder)
              </h4>
              <p className="text-xs text-[#5E5854]">
                Plot 42, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:+917977641125"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#2D2926]/15 text-xs font-mono font-bold text-[#2D2926] hover:bg-[#FAF7F5] transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-[#E05A7E]" />
                <span>+91 79776 41125</span>
              </a>

              <a
                href="mailto:priyanshubipin2006@gmail.com"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2D2926] text-white text-xs font-mono font-bold hover:bg-black transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-[#F5DADF]" />
                <span>Email Grievance Desk</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LegalPage;
