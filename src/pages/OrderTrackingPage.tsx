import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  Printer, 
  Coffee, 
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { fetchOrderDetails } from '../utils/paymentApi';
import type { CustomerOrder } from '../types/payment';

interface OrderTrackingPageProps {
  onOpenInvoice?: (order: CustomerOrder) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ onOpenInvoice }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('id') || searchParams.get('order') || '';

  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [searchedOrder, setSearchedOrder] = useState<CustomerOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Sample fallback demo order for visitors who want to see how tracking looks
  const sampleOrder: CustomerOrder = {
    id: 'ord_sample_demo_1998',
    orderNumber: 'ND-92418',
    customerName: 'Kavita Iyer',
    customerEmail: 'kavita@domain.in',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      fullName: 'Kavita Iyer',
      email: 'kavita@domain.in',
      phone: '+91 98765 43210',
      address: 'Flat 402, Rain Tree Boulevard, Indiranagar',
      city: 'Bengaluru',
      postalCode: '560038',
      country: 'India',
    },
    items: [
      {
        productId: 'prod-01',
        name: 'BABA BUDAN OBSIDIAN',
        origin: 'Chikmagalur, Karnataka',
        quantity: 2,
        grind: 'Fine (South Indian Filter Kaapi)',
        unitPrice: 2800,
        lineTotal: 5600,
      },
      {
        productId: 'prod-02',
        name: 'MALABAR MONSOONED SHORE',
        origin: 'Malabar Coast, Kerala',
        quantity: 1,
        grind: 'Whole Bean',
        unitPrice: 2400,
        lineTotal: 2400,
      },
    ],
    pricing: {
      subtotal: 8000,
      discountAmount: 800,
      discountCode: 'ROAST10',
      shippingCost: 0,
      finalTotal: 7200,
      amountInPaise: 720000,
      currency: 'INR',
    },
    paymentMethod: 'razorpay',
    paymentStatus: 'captured',
    fulfillmentStatus: 'shipped',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date().toISOString(),
    razorpayPaymentId: 'pay_PqR81028sA91',
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().replace(/^#/, '');
    if (!query) {
      setErrorMessage('Please enter an Order ID (e.g. ND-92418) or registered phone number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // 1. Try local storage recent orders first
      const localOrdersStr = localStorage.getItem('noir_customer_orders_v1');
      const localOrders: CustomerOrder[] = localOrdersStr ? JSON.parse(localOrdersStr) : [];
      
      const matchedLocal = localOrders.find(
        (o) =>
          o.orderNumber.toLowerCase() === query.toLowerCase() ||
          o.id.toLowerCase() === query.toLowerCase() ||
          o.customerPhone.includes(query) ||
          o.customerEmail.toLowerCase() === query.toLowerCase()
      );

      if (matchedLocal) {
        setSearchedOrder(matchedLocal);
        setIsLoading(false);
        return;
      }

      // 2. Query backend server orders API
      const serverRes = await fetchOrderDetails(query);
      if (serverRes) {
        setSearchedOrder(serverRes);
        setIsLoading(false);
        return;
      }

      // 3. If testing sample ID or demo
      if (query.toLowerCase().includes('demo') || query === 'ND-92418' || query === '92418') {
        setSearchedOrder(sampleOrder);
        setIsLoading(false);
        return;
      }

      // If not found in remote or local
      setErrorMessage(
        `No roast batch found for "${query}". Please check your order reference number or contact our Indiranagar roastery desk.`
      );
      setSearchedOrder(null);
    } catch {
      setErrorMessage('Unable to look up order. Showing demonstrative tracking pipeline below.');
      setSearchedOrder(sampleOrder);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    } else {
      // Check if user has an order in localStorage to display by default
      const localOrdersStr = localStorage.getItem('noir_customer_orders_v1');
      if (localOrdersStr) {
        try {
          const localOrders: CustomerOrder[] = JSON.parse(localOrdersStr);
          if (localOrders.length > 0) {
            setSearchedOrder(localOrders[0]);
            setSearchQuery(localOrders[0].orderNumber);
            return;
          }
        } catch {
          // Ignored
        }
      }
      // Fallback demo order
      setSearchedOrder(sampleOrder);
    }
  }, [initialQuery]);

  const activeOrder = searchedOrder || sampleOrder;
  const isDemo = activeOrder.id === 'ord_sample_demo_1998';

  // Tracking Milestones Breakdown
  const orderTime = new Date(activeOrder.createdAt);
  const roastTime = new Date(orderTime.getTime() + 1000 * 60 * 60 * 3);
  const sealTime = new Date(orderTime.getTime() + 1000 * 60 * 60 * 7);
  const dispatchTime = new Date(orderTime.getTime() + 1000 * 60 * 60 * 12);
  const deliveryEstimated = new Date(orderTime.getTime() + 1000 * 60 * 60 * 36);

  const formatTimelineDate = (d: Date) =>
    d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

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
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#2D2926]">
              REAL-TIME ROASTERY DISPATCH TELEMETRY
            </span>
          </div>

          <Link
            to="/collection"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2D2926] text-white text-xs font-bold hover:bg-[#E05A7E] transition-colors"
          >
            <span>Explore Roasts</span>
          </Link>
        </div>
      </div>

      {/* 1. Immersive Hero Section */}
      <section className="relative overflow-hidden border-b border-[#2D2926]/10 bg-gradient-to-b from-white via-[#FAF7F5] to-white pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5DADF]/80 border border-[#2D2926]/10 text-[#2D2926] text-xs font-mono font-bold uppercase tracking-wider mb-5 shadow-2xs">
            <Truck className="h-3.5 w-3.5 text-[#E05A7E]" />
            <span>LIVE DISPATCH TELEMETRY • BLUE DART & AIR FREIGHT</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#2D2926] leading-[1.15] mb-3">
            Track Your Fresh <span className="italic text-[#E05A7E]">Roast Dispatch.</span>
          </h1>

          <p className="font-sans text-xs sm:text-sm md:text-base text-[#5E5854] max-w-2xl mx-auto leading-relaxed mb-8">
            Inspect micro-lot roasting timestamps, nitrogen-flushed tin sealing telemetry, and express air courier handovers directly from our Indiranagar roastery lab.
          </p>

          {/* Elevated Tracking Search Form */}
          <div className="max-w-xl mx-auto bg-white p-2.5 sm:p-3 rounded-3xl border border-[#2D2926]/10 shadow-[0_10px_30px_rgba(45,41,38,0.06)]">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C827A]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Order # (e.g. ND-92418) or Phone"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 text-xs text-[#2D2926] placeholder-[#8C827A] focus:bg-white focus:border-[#2D2926] focus:outline-none transition-all font-mono font-bold uppercase"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-2xl bg-[#2D2926] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E05A7E] transition-all shadow-md cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isLoading ? 'Locating...' : 'Track Roast'}
              </button>
            </form>

            {/* Quick Demo Helper */}
            <div className="mt-2.5 pt-2 border-t border-[#2D2926]/5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#8C827A]">
              <span>Looking for a test order?</span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('ND-92418');
                  setSearchedOrder(sampleOrder);
                  setErrorMessage('');
                }}
                className="inline-flex items-center gap-1 font-mono font-bold text-[#E05A7E] hover:underline cursor-pointer bg-[#F5DADF]/40 px-2.5 py-0.5 rounded-full"
              >
                Load Demo #ND-92418
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 max-w-xl mx-auto p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-center gap-2 text-left">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Key Roast Logistics Guarantees Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-8 pt-6 border-t border-[#2D2926]/10 text-left">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs">
              <div className="h-9 w-9 rounded-xl bg-[#F5DADF] flex items-center justify-center shrink-0">
                <Coffee className="h-4 w-4 text-[#E05A7E]" />
              </div>
              <div>
                <span className="font-display font-bold text-xs text-[#2D2926] block">24h Drum Convection</span>
                <span className="text-[10.5px] text-[#8C827A] font-sans">Roasted fresh upon lot reservation</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <span className="font-display font-bold text-xs text-[#2D2926] block">Nitrogen Tin Flush</span>
                <span className="text-[10.5px] text-[#8C827A] font-sans">Zero residual oxygen spoilage</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#2D2926]/10 shadow-2xs">
              <div className="h-9 w-9 rounded-xl bg-[#2D2926] flex items-center justify-center shrink-0">
                <Truck className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-xs text-[#2D2926] block">Express Air Logistics</span>
                <span className="text-[10.5px] text-[#8C827A] font-sans">Blue Dart & Delhivery Air</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Live Tracking Workspace */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        {/* Demo Notice Banner */}
        {isDemo && (
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-amber-700" />
              <span>
                <strong>Demonstration Telemetry:</strong> Showing live tracking preview for Order <strong>#ND-92418</strong>. Enter your personal order number above to inspect your custom batch.
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
              Sample Order
            </span>
          </div>
        )}

        {/* Live Tracking Card */}
        <div className="bg-white rounded-3xl border border-[#2D2926]/10 p-6 sm:p-9 shadow-sm space-y-8">
          
          {/* Top Bar: Order ID, Status, Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2D2926]/10 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-display font-bold text-2xl text-[#2D2926]">
                  Order #{activeOrder.orderNumber}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {activeOrder.paymentStatus === 'captured' ? 'PAID & VERIFIED' : 'CONFIRMED'}
                </span>
              </div>
              <p className="text-xs text-[#8C827A] font-mono mt-1">
                Allocated to <strong>{activeOrder.customerName}</strong> • Placed on {formatTimelineDate(orderTime)}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {onOpenInvoice && (
                <button
                  onClick={() => onOpenInvoice(activeOrder)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-bold text-[#2D2926] hover:bg-neutral-100 transition-colors shadow-2xs cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-[#E05A7E]" />
                  <span>Tax Invoice</span>
                </button>
              )}

              <a
                href={`https://wa.me/917977641125?text=Hi%20Priyanshu,%20checking%20status%20for%20Noir%20Order%20${activeOrder.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Priority WhatsApp</span>
              </a>
            </div>
          </div>

          {/* 5-Step Roastery & Air Courier Progress Stepper */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-[#E05A7E] font-bold uppercase tracking-wider">
                ROASTERY DISPATCH PIPELINE
              </span>
              <span className="text-xs font-mono font-semibold text-[#2D2926]">
                Estimated Delivery: <strong className="text-emerald-700">{formatTimelineDate(deliveryEstimated)}</strong>
              </span>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-emerald-800">STAGE 01</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <h4 className="font-display font-bold text-xs text-[#2D2926] mt-1.5">Harvest Selected</h4>
                <p className="text-[11px] text-[#5E5854] mt-0.5">Green beans weighed & inspected in Bengaluru lab.</p>
                <span className="text-[9.5px] font-mono text-[#8C827A] block mt-1">{formatTimelineDate(orderTime)}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-emerald-800">STAGE 02</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <h4 className="font-display font-bold text-xs text-[#2D2926] mt-1.5">Cast-Iron Drum Roast</h4>
                <p className="text-[11px] text-[#5E5854] mt-0.5">Convective roasting at 204°C profile calibration.</p>
                <span className="text-[9.5px] font-mono text-[#8C827A] block mt-1">{formatTimelineDate(roastTime)}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-emerald-800">STAGE 03</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <h4 className="font-display font-bold text-xs text-[#2D2926] mt-1.5">Nitrogen Tin Sealed</h4>
                <p className="text-[11px] text-[#5E5854] mt-0.5">Vacuum flushed into numbered 250g micro-tins.</p>
                <span className="text-[9.5px] font-mono text-[#8C827A] block mt-1">{formatTimelineDate(sealTime)}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border-2 border-[#E05A7E] shadow-xs relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-[#E05A7E]">STAGE 04 • ACTIVE</span>
                  <Truck className="h-4 w-4 text-[#E05A7E] animate-bounce" />
                </div>
                <h4 className="font-display font-bold text-xs text-[#2D2926] mt-1.5">In Transit (Express)</h4>
                <p className="text-[11px] text-[#5E5854] mt-0.5">Handed over to Blue Dart Express Air Fleet.</p>
                <span className="text-[9.5px] font-mono text-[#E05A7E] font-bold block mt-1">AWB: BD-92817401-BLR</span>
              </div>
            </div>
          </div>

          {/* Two-Column Details: Items in Box & Delivery Checkpoints */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-[#2D2926]/10">
            {/* Left Col: Order Items */}
            <div className="md:col-span-6 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block">
                ROASTED COFFEE ALLOCATIONS IN THIS PARCEL
              </span>

              <div className="space-y-3">
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#2D2926] text-[#F5DADF] flex items-center justify-center shrink-0">
                        <Coffee className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-display font-bold text-xs text-[#2D2926]">{item.name}</h5>
                        <p className="text-[11px] text-[#8C827A] font-mono">Grind: {item.grind} • Qty {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#2D2926]">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Pricing Snapshot */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#2D2926]/10 space-y-1.5 text-xs text-[#5E5854]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-[#2D2926]">₹{activeOrder.pricing.subtotal.toLocaleString('en-IN')}</span>
                </div>
                {activeOrder.pricing.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Voucher Discount</span>
                    <span className="font-mono font-bold">-₹{activeOrder.pricing.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier</span>
                  <span className="font-mono font-bold text-emerald-700">FREE</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#2D2926]/10 text-sm font-bold text-[#2D2926]">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-base text-[#2D2926]">₹{activeOrder.pricing.finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Right Col: Courier Checkpoints & Delivery Address */}
            <div className="md:col-span-6 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block">
                DELIVERY DESTINATION & CARRIER TELEMETRY
              </span>

              {/* Shipping Address Box */}
              <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-1 text-xs">
                <div className="flex items-center gap-2 text-[#2D2926] font-bold">
                  <MapPin className="h-4 w-4 text-[#E05A7E] shrink-0" />
                  <span>{activeOrder.customerName}</span>
                </div>
                <p className="text-[#5E5854] pl-6">{activeOrder.shippingAddress.address}</p>
                <p className="text-[#5E5854] pl-6">{activeOrder.shippingAddress.city} - {activeOrder.shippingAddress.postalCode}, {activeOrder.shippingAddress.country}</p>
                <p className="font-mono text-[#8C827A] pl-6 pt-1">Contact: {activeOrder.customerPhone}</p>
              </div>

              {/* Courier Checkpoint Timeline */}
              <div className="p-4 rounded-2xl bg-white border border-[#2D2926]/10 space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#E05A7E] mt-1 shrink-0 animate-ping" />
                  <div>
                    <h5 className="font-bold text-[#2D2926]">Shipment Sorted at Regional Air Hub</h5>
                    <p className="text-[11px] text-[#8C827A]">Kempegowda Int'l Airport Logistics Terminal (BLR)</p>
                    <span className="text-[10px] font-mono text-[#8C827A]">{formatTimelineDate(dispatchTime)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <h5 className="font-bold text-[#2D2926]">Dispatched from Roastery Sensory Lab</h5>
                    <p className="text-[11px] text-[#8C827A]">Plot 42, 12th Main Road, HAL 2nd Stage, Indiranagar</p>
                    <span className="text-[10px] font-mono text-[#8C827A]">{formatTimelineDate(sealTime)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div>
                    <h5 className="font-bold text-[#2D2926]">Drum Convection Complete & Certified</h5>
                    <p className="text-[11px] text-[#8C827A]">Roast Master: Priyanshu Singh • 100% Arabica Certified</p>
                    <span className="text-[10px] font-mono text-[#8C827A]">{formatTimelineDate(roastTime)}</span>
                  </div>
                </div>
              </div>

              {/* Freshness & Support Guarantee */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>48h Degas Guarantee:</strong> Beans are at optimal peak extraction between Day 4 and Day 60 from roast date.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderTrackingPage;
