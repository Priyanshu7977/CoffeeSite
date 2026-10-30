import React, { useState } from 'react';
import { ChevronDown, Sparkles, Coffee, Compass, Truck } from 'lucide-react';

export interface FaqItem {
  question: string;
  category: 'brewing' | 'origin' | 'roasting' | 'delivery';
  shortAnswer: string;
  detailedAnswer: string;
}

export const ROASTERY_FAQS: FaqItem[] = [
  {
    category: 'origin',
    question: 'What makes South Indian Single-Estate Filter Coffee unique?',
    shortAnswer: '100% shade-grown under natural forest canopies in the Western Ghats, yielding low natural bitterness and elevated aromatic complexity.',
    detailedAnswer:
      'Unlike direct-sun monoculture plantations in other continents, South Indian coffee is strictly cultivated beneath multi-tiered shade canopies of silver oak, wild jackfruit, rosewood, and pepper vines in regions like Chikmagalur and Coorg. The slow cherry maturation concentrates natural fruit sugars (sucrose), creating deep notes of raw jaggery, cardamom, and bittersweet Mysore cacao without harsh bitterness.',
  },
  {
    category: 'brewing',
    question: 'How do I brew the authentic South Indian Filter Kaapi with a Brass Davarah?',
    shortAnswer: 'Use a 1:5 coffee-to-water decoction ratio, steep 12–15 minutes in a brass gravity filter, and meter with hot scalded milk and jaggery.',
    detailedAnswer:
      'Place 20g of medium-fine roasted coffee into the top compartment of the traditional brass filter. Rest the perforated pressing disc gently on the grounds without pressing down hard. Pour 100ml of freshly boiled water (94°C) over the disc and close the lid. Allow 12 to 15 minutes for the thick decoction to filter into the bottom chamber. In a brass davarah tumbler, combine 40ml of decoction with 100ml of hot scalded whole milk and raw jaggery, pouring back and forth from height to aerate and produce a rich, velvet golden froth.',
  },
  {
    category: 'roasting',
    question: 'Where and how is NOIR ROAST coffee roasted?',
    shortAnswer: 'Slow-roasted in 12kg cast-iron convection drums at our Indiranagar roastery in Bengaluru to order.',
    detailedAnswer:
      'Every micro-lot is roasted in small 12kg convection drum roasters at our tasting room on 100ft Road, Indiranagar, Bengaluru. We apply customized thermal curves tailored to the density and moisture level of each estate harvest, immediately followed by nitrogen purging in sealed valve tins to lock in aromatics for up to 90+ days.',
  },
  {
    category: 'origin',
    question: 'What is Malabar Monsooned Coffee and how is it processed?',
    shortAnswer: 'Raw green Arabica beans exposed to Arabian Sea monsoon winds for 16 weeks, yielding near-zero acidity and heavy dark chocolate body.',
    detailedAnswer:
      'Historically originating during 4-month sea voyages to Europe in wooden clipper ships, authentic Malabar Monsooning exposes harvest beans in open-sided brick warehouses to the moisture-laden southwest monsoon winds of the Malabar coast. Over 16 weeks, the beans swell to double size, turn pale golden, lose sharp acidity, and develop unmatched syrupy mouthfeel and roasted malt sweetness.',
  },
  {
    category: 'delivery',
    question: 'How fast is express shipping and what payment options are accepted?',
    shortAnswer: 'Free express courier across India within 24–48 hours; Razorpay UPI, Cards, Roastery QR, and Cash on Delivery (+₹100) supported.',
    detailedAnswer:
      'All orders are dispatched via air express couriers directly from our Bengaluru roastery within 24 hours of batch roasting. Metros receive delivery within 24–48 hours, while tier-2 and tier-3 cities receive delivery within 3–4 days. We support Razorpay UPI, Netbanking, direct Roastery Bank QR verification, and Cash on Delivery with an additional ₹100 handling fee.',
  },
  {
    category: 'brewing',
    question: 'Which grind size should I choose when ordering?',
    shortAnswer: 'Choose Whole Bean for freshness, Brass Filter for traditional kaapi, Pour Over for V60/Chemex, or 9-Bar Espresso for espresso machines.',
    detailedAnswer:
      'For maximum freshness, Whole Bean is recommended if you have a burr grinder. Otherwise, our South Indian Brass Filter grind is medium-fine to prevent clogging while ensuring complete extraction; Pour Over is medium-fine with minimal fines; French Press/Cold Brew is coarse; and 9-Bar Espresso is calibrated micro-fine for dense golden crema.',
  },
];

export const CoffeeKnowledgeFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Queries' },
    { id: 'brewing', label: 'Brewing Calibration' },
    { id: 'origin', label: 'Estate Terroir' },
    { id: 'roasting', label: 'Roast Profile' },
    { id: 'delivery', label: 'Dispatch & Payment' },
  ];

  const filteredFaqs =
    activeCategory === 'all'
      ? ROASTERY_FAQS
      : ROASTERY_FAQS.filter((f) => f.category === activeCategory);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq-section"
      aria-labelledby="faq-heading"
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
    >
      {/* Schema.org FAQPage Structured Data for Google AI Overviews & Answer Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: ROASTERY_FAQS.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${faq.shortAnswer} ${faq.detailedAnswer}`,
              },
            })),
          }),
        }}
      />

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-stone-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Authoritative Knowledge & AEO Codex</span>
        </div>
        <h2
          id="faq-heading"
          className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight"
        >
          Specialty Coffee & Terroir FAQ
        </h2>
        <p className="mt-3 text-stone-600 text-sm sm:text-base max-w-2xl mx-auto">
          Calibrated answers on South Indian single-estate origins, brass davarah extraction,
          convection drum roasting, and fresh roastery delivery across India.
        </p>

        {/* Category Filter Pills (SXO / AXO Friendly) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List with Accessible ARIA Landmarks */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const contentId = `faq-content-${idx}`;
          const buttonId = `faq-button-${idx}`;

          return (
            <div
              key={faq.question}
              className="border border-stone-200 rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-200"
            >
              <button
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleAccordion(idx)}
                className="w-full flex items-center justify-between text-left px-5 sm:px-6 py-4 sm:py-5 hover:bg-stone-50/75 transition-colors gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-stone-600">
                    {faq.category === 'brewing' && <Coffee className="w-4 h-4 text-amber-700" />}
                    {faq.category === 'origin' && <Compass className="w-4 h-4 text-emerald-700" />}
                    {faq.category === 'roasting' && <Sparkles className="w-4 h-4 text-orange-700" />}
                    {faq.category === 'delivery' && <Truck className="w-4 h-4 text-blue-700" />}
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-stone-900 leading-snug">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-stone-800' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="px-5 sm:px-6 pb-5 pt-1 text-stone-700 border-t border-stone-100 bg-stone-50/40"
                >
                  {/* Direct concise snippet for fast AEO & AI Overview ingestion */}
                  <div className="p-3 bg-amber-50/70 border-l-4 border-amber-600 rounded-r-lg mb-3">
                    <p className="text-xs sm:text-sm font-semibold text-stone-900">
                      Quick Answer:
                    </p>
                    <p className="text-xs sm:text-sm text-stone-800 mt-0.5">
                      {faq.shortAnswer}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-stone-600">
                    {faq.detailedAnswer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
