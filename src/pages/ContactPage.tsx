import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  Building,
  Coffee,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sanitizeName, isValidEmail, isValidName, hasMaliciousContent } from '../utils/validation';

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [inquiryType, setInquiryType] = useState<string>('General Inquiry');
  const [message, setMessage] = useState<string>('');
  
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (hasMaliciousContent(fullName) || hasMaliciousContent(email) || hasMaliciousContent(message)) {
      setErrorMsg('Security Alert: HTML or script elements are strictly blocked.');
      return;
    }

    if (!isValidName(fullName)) {
      setErrorMsg('Please enter a valid full name (alphabets only).');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (message.trim().length < 10) {
      setErrorMsg('Please include a brief message (minimum 10 characters).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const ticketId = `NOIR-${Math.floor(1000 + Math.random() * 9000)}`;
      
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#E05A7E', '#2D2926', '#FAF7F5'],
      });

      setSuccessMsg(
        `Thank you ${sanitizeName(fullName)}! Your dispatch has been routed directly to founder Priyanshu Singh (Ref: ${ticketId}). We will respond within 2 hours.`
      );

      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] selection:bg-[#E05A7E] selection:text-white pb-32">
      {/* 1. Sub-Header (Safely positioned below global Navbar) */}
      <div className="pt-[max(calc(env(safe-area-inset-top)+5.25rem),6.5rem)] sm:pt-28 md:pt-32 pb-3.5 sm:pb-4 px-4 sm:px-8 border-b border-[#2D2926]/10 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </button>
            <span className="text-xs font-mono text-[#8C827A] hidden sm:inline">
              / CONTACT US
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-xs font-mono text-[#2D2926] font-bold hidden sm:inline">ROASTERY OPEN TODAY</span>
            <span className="text-xs font-mono text-[#2D2926] font-bold sm:hidden">OPEN TODAY</span>
          </div>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="px-4 sm:px-8 pt-12 pb-10 border-b border-[#2D2926]/10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5DADF] text-[#2D2926] text-xs font-bold tracking-wider uppercase mb-5">
            <MessageSquare className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>CUSTOMER CARE & ROASTERY</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-[#2D2926] leading-[1.08] mb-5">
            Let's Talk <span className="italic text-[#E05A7E]">Coffee</span>, Collaborations & Orders.
          </h1>

          <p className="max-w-2xl mx-auto text-[#5E5854] text-base leading-relaxed font-sans font-normal">
            Whether you want to drop by our Bengaluru tasting bar in Indiranagar, collaborate on a college festival popup, or order wholesale micro-lots—we'd love to brew a cup with you.
          </p>
        </div>
      </section>

      {/* 3. PROPER MAP SECTION (Visually embedded on website) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 pt-12">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block mb-1">
              ROASTERY LOCATION & SENSORY LAB
            </span>
            <h2 className="font-display text-2xl font-bold text-[#2D2926]">
              Find Our Bengaluru Roastery
            </h2>
          </div>
          <a
            href="https://maps.google.com/?q=12th+Main+Rd+Indiranagar+Bengaluru"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#E05A7E] hover:underline"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Embedded Responsive Google Map Iframe */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-[#2D2926] shadow-[0_20px_50px_rgba(45,41,38,0.12)] bg-[#EAE5DF]">
          <iframe
            title="Noir Specialty Coffee Roastery Map"
            src="https://maps.google.com/maps?q=12th%20Main%20Rd,%20Indiranagar,%20Bengaluru,%20Karnataka%20560038&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[320px] sm:h-[420px] border-0"
            loading="lazy"
            allowFullScreen
          />

          {/* Floating Location Card Overlay */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#2D2926]/15 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#F5DADF] text-[#E05A7E] flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#2D2926]">
                  Noir Coffee Roastery & Tasting Lab
                </h3>
                <p className="text-xs text-[#5E5854] mt-0.5 leading-relaxed">
                  Plot 42, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038
                </p>
                <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-[#8C827A]">
                  <Clock className="h-3.5 w-3.5 text-[#E05A7E]" />
                  <span>Mon – Sun: 8:00 AM – 9:00 PM IST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONTACT FORM (Positioned directly after the map) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Interactive Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#2D2926]/10 p-6 sm:p-10 shadow-[0_20px_50px_rgba(45,41,38,0.06)]">
            <div className="mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E05A7E] font-bold block mb-1">
                ONLINE DISPATCH
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#2D2926]">
                Send a Direct Message
              </h2>
              <p className="text-xs text-[#5E5854] mt-1">
                Fill in your details below. Messages are routed directly to the founder's desk.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#2D2926] font-bold block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arjun Gowda"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 text-xs text-[#2D2926] placeholder-[#8C827A] focus:outline-none focus:border-[#E05A7E] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#2D2926] font-bold block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. arjun@western-ghats.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 text-xs text-[#2D2926] placeholder-[#8C827A] focus:outline-none focus:border-[#E05A7E] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-[#2D2926] font-bold block mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 text-xs text-[#2D2926] placeholder-[#8C827A] focus:outline-none focus:border-[#E05A7E] transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase text-[#2D2926] font-bold block mb-1">
                    Inquiry Type
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 text-xs text-[#2D2926] focus:outline-none focus:border-[#E05A7E] transition-all cursor-pointer"
                  >
                    <option value="General Inquiry">General Question & Feedback</option>
                    <option value="College Startup Collaboration">College Festival / Campus Popup Collaboration</option>
                    <option value="Bulk Roasting">Bulk Office / Wholesale Coffee</option>
                    <option value="Private Reserve Order">Custom / Bulk Coffee Order</option>
                    <option value="Roastery Visit">Roastery Tasting Session Booking</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono uppercase text-[#2D2926] font-bold block mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about what you're looking for, your brew preference, or event details..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 text-xs text-[#2D2926] placeholder-[#8C827A] focus:outline-none focus:border-[#E05A7E] transition-all"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  {successMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#2D2926] text-[#FAF7F5] font-bold text-xs uppercase tracking-wider hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                <Send className="h-4 w-4 text-[#E05A7E]" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

          {/* Right: CONTACT DETAILS OF OWNER (EXACT INFO SPECIFIED) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Owner Direct Contact Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#2D2926] text-[#FAF7F5] shadow-xl relative overflow-hidden">
              <div className="pointer-events-none absolute -right-10 -bottom-10 w-44 h-44 bg-[#E05A7E]/20 blur-[60px] rounded-full" />

              <div className="relative z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F5DADF] font-bold block mb-2">
                  FOUNDER & OWNER DESK
                </span>
                <h3 className="font-display text-2xl font-bold mb-1">Priyanshu Singh</h3>
                <p className="text-xs text-[#FAF7F5]/70 mb-6">
                  Founder & Head Roaster • Noir Dakshin Coffee
                </p>

                <div className="space-y-4 text-xs">
                  {/* Phone Number */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-[#E05A7E]/20 text-[#E05A7E] flex items-center justify-center shrink-0">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-white/50 block">OWNER PHONE NUMBER</span>
                        <a 
                          href="tel:+917977641125" 
                          className="font-mono font-bold text-sm text-[#FAF7F5] hover:text-[#F5DADF] transition-colors"
                        >
                          +91 79776 41125
                        </a>
                      </div>
                    </div>

                    <a
                      href="https://wa.me/917977641125?text=Hi%20Priyanshu,%20I'm%20reaching%20out%20from%20the%20Noir%20Roast%20website!"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold hover:bg-emerald-500/30 transition-all"
                    >
                      WhatsApp
                    </a>
                  </div>

                  {/* Email ID */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#E05A7E]/20 text-[#E05A7E] flex items-center justify-center shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-white/50 block">DIRECT EMAIL ID</span>
                      <a 
                        href="mailto:priyanshubipin2006@gmail.com" 
                        className="font-mono font-bold text-xs sm:text-sm text-[#FAF7F5] hover:text-[#F5DADF] transition-colors break-all"
                      >
                        priyanshubipin2006@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#E05A7E]/20 text-[#E05A7E] flex items-center justify-center shrink-0">
                      <Building className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-white/50 block">ROASTERY ADDRESS</span>
                      <span className="text-xs text-[#FAF7F5] leading-snug block">
                        Plot 42, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, KA 560038
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#FAF7F5]/60 font-mono">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Guaranteed response within 2 hours for college & wholesale inquiries.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. BALANCED 2-COLUMN STUDENT & CAMPUS PERKS SECTION (Left & Right Both Filled) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card: Campus Ambassador & Fellowship */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#2D2926]/10 shadow-[0_15px_40px_rgba(45,41,38,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E05A7E]">
                  <GraduationCap className="h-4 w-4" />
                  <span>CAMPUS FELLOWSHIP PROGRAM</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F5DADF] text-[#2D2926] text-[10px] font-mono font-bold">
                  15% STUDENT PERK
                </span>
              </div>
              <h4 className="font-display font-bold text-xl text-[#2D2926] mb-2">
                Represent Noir Roast in Your College
              </h4>
              <p className="text-xs sm:text-sm text-[#5E5854] leading-relaxed mb-4">
                Passionate about specialty coffee in your university? Join our student ambassador fellowship. Get complimentary monthly coffee tins, 15% discount vouchers for your campus peers, barista brewing kit gear, and hands-on roasting mentorship at our Indiranagar roastery lab.
              </p>
            </div>

            <div className="pt-4 border-t border-[#2D2926]/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#8C827A]">Over 12+ Campus Partners</span>
              <a
                href="https://wa.me/917977641125?text=Hi%20Priyanshu,%20I'm%20a%20college%20student%20interested%20in%20the%20Noir%20Campus%20Ambassador%20Fellowship!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#2D2926] text-[#FAF7F5] text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                Apply as Fellow
              </a>
            </div>
          </div>

          {/* Right Card: College Event & Hackathon Roastery Setup */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#2D2926]/10 shadow-[0_15px_40px_rgba(45,41,38,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E05A7E]">
                  <Coffee className="h-4 w-4" />
                  <span>STUDENT & CAMPUS EVENT PERK</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-[#2D2926] text-[10px] font-mono font-bold">
                  SUBSIDIZED POPUP
                </span>
              </div>
              <h4 className="font-display font-bold text-xl text-[#2D2926] mb-2">
                Organizing a College Event or Hackathon?
              </h4>
              <p className="text-xs sm:text-sm text-[#5E5854] leading-relaxed mb-4">
                As a student-led startup, we provide subsidized fresh pour-over bar setups, nitrogen cold brew kegs, and sensory cupping workshops for collegiate hackathons, conferences, and cultural fests across Bengaluru and South India. Contact founder Priyanshu directly!
              </p>
            </div>

            <div className="pt-4 border-t border-[#2D2926]/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#8C827A]">Available for 2026 Season</span>
              <a
                href="https://wa.me/917977641125?text=Hi%20Priyanshu,%20I'm%20organizing%20a%20college%20event/hackathon%20and%20would%20love%20a%20Noir%20Roast%20pour-over%20bar%20setup!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C89658] to-[#E05A7E] text-[#0E0C0A] text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-sm"
              >
                Book Pour-Over Bar
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
