import React from 'react';
import { 
  X, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Printer, 
  Coffee, 
  MessageCircle 
} from 'lucide-react';
import type { CustomerOrder } from '../types/payment';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: CustomerOrder | null;
  onOpenInvoice?: (order: CustomerOrder) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  order,
  onOpenInvoice,
}) => {
  if (!isOpen || !order) return null;

  const orderTime = new Date(order.createdAt);
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
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#2D2926]/75 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-white border border-[#2D2926]/10 p-5 sm:p-8 shadow-2xl text-[#2D2926] max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#2D2926]/10 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display font-bold text-xl sm:text-2xl text-[#2D2926]">
                Order #{order.orderNumber}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {order.paymentStatus === 'captured' ? 'PAID & VERIFIED' : 'CONFIRMED'}
              </span>
            </div>
            <p className="text-xs text-[#8C827A] font-mono mt-1">
              Allocated to <strong>{order.customerName}</strong> • Reserved on {formatTimelineDate(orderTime)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#5E5854] hover:bg-[#FAF7F5] hover:text-[#2D2926] transition-colors cursor-pointer shrink-0"
            aria-label="Close Tracking Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 4-Stage Roastery & Air Courier Progress Stepper */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-[#E05A7E] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="h-3.5 w-3.5" />
              <span>LIVE ROASTERY DISPATCH PIPELINE</span>
            </span>
            <span className="text-xs font-mono font-semibold text-[#2D2926]">
              Estimated Delivery: <strong className="text-emerald-700">{formatTimelineDate(deliveryEstimated)}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-800">STAGE 01</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <h4 className="font-display font-bold text-xs text-[#2D2926] mt-1.5">Harvest Selected</h4>
              <p className="text-[11px] text-[#5E5854] mt-0.5">Green cherries inspected in Bengaluru lab.</p>
              <span className="text-[9.5px] font-mono text-[#8C827A] block mt-1">{formatTimelineDate(orderTime)}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-800">STAGE 02</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <h4 className="font-display font-bold text-xs text-[#2D2926] mt-1.5">Cast-Iron Drum Roast</h4>
              <p className="text-[11px] text-[#5E5854] mt-0.5">204°C profile convective roasting.</p>
              <span className="text-[9.5px] font-mono text-[#8C827A] block mt-1">{formatTimelineDate(roastTime)}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-800">STAGE 03</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <h4 className="font-display font-bold text-xs text-[#2D2926] mt-1.5">Nitrogen Tin Sealed</h4>
              <p className="text-[11px] text-[#5E5854] mt-0.5">Vacuum flushed into 250g micro-tins.</p>
              <span className="text-[9.5px] font-mono text-[#8C827A] block mt-1">{formatTimelineDate(sealTime)}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border-2 border-[#E05A7E] shadow-xs relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[#E05A7E]">STAGE 04 • ACTIVE</span>
                <Truck className="h-4 w-4 text-[#E05A7E] animate-bounce" />
              </div>
              <h4 className="font-display font-bold text-xs text-[#2D2926] mt-1.5">In Transit (Express)</h4>
              <p className="text-[11px] text-[#5E5854] mt-0.5">Handed over to Blue Dart Express Air.</p>
              <span className="text-[9.5px] font-mono text-[#E05A7E] font-bold block mt-1">AWB: BD-92817401-BLR</span>
            </div>
          </div>
        </div>

        {/* Two-Column Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2 border-t border-[#2D2926]/10">
          {/* Left: Items in Box & Cost */}
          <div className="md:col-span-6 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block">
              COFFEE ALLOCATIONS IN THIS SHIPMENT
            </span>

            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-[#2D2926] text-[#F5DADF] flex items-center justify-center shrink-0">
                      <Coffee className="h-4 w-4" />
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-xs text-[#2D2926]">{item.name}</h5>
                      <p className="text-[10.5px] text-[#8C827A] font-mono">{item.grind} • Qty {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#2D2926]">
                    ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-between text-xs font-bold text-[#2D2926]">
              <span>Final Total Paid</span>
              <span className="font-mono text-sm text-[#2D2926]">₹{order.pricing.finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Right: Checkpoints & Destination */}
          <div className="md:col-span-6 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C827A] font-bold block">
              CARRIER CHECKPOINTS & DESTINATION
            </span>

            {/* Address */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 text-xs space-y-1">
              <div className="flex items-center gap-2 text-[#2D2926] font-bold">
                <MapPin className="h-3.5 w-3.5 text-[#E05A7E] shrink-0" />
                <span>{order.customerName}</span>
              </div>
              <p className="text-[#5E5854] pl-5.5">{order.shippingAddress.address}</p>
              <p className="text-[#5E5854] pl-5.5">{order.shippingAddress.city} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
              <p className="font-mono text-[#8C827A] pl-5.5 text-[11px]">Phone: {order.customerPhone}</p>
            </div>

            {/* Checkpoints */}
            <div className="p-3.5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-[#E05A7E] mt-1 shrink-0 animate-ping" />
                <div>
                  <h5 className="font-bold text-[#2D2926] text-[11px]">Kempegowda Int'l Air Terminal (BLR)</h5>
                  <p className="text-[10px] text-[#8C827A]">{formatTimelineDate(dispatchTime)} • In Flight Transit</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <div>
                  <h5 className="font-bold text-[#2D2926] text-[11px]">Dispatched from Indiranagar Roastery</h5>
                  <p className="text-[10px] text-[#8C827A]">{formatTimelineDate(sealTime)} • Handed over to Blue Dart</p>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span><strong>48h Degas Guarantee:</strong> Peak aroma reached on arrival.</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#2D2926]/10">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenInvoice && (
              <button
                onClick={() => onOpenInvoice(order)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-bold text-[#2D2926] hover:bg-neutral-100 transition-colors shadow-2xs cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5 text-[#E05A7E]" />
                <span>View Tax Invoice</span>
              </button>
            )}

            <a
              href={`https://wa.me/917977641125?text=Hi%20Priyanshu,%20checking%20status%20for%20Noir%20Order%20${order.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Roaster Support</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2D2926] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors shadow-sm cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderTrackingModal;
