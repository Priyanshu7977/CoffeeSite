import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Award,
  LogOut,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Package,
  Clock,
  Truck,
  RotateCcw,
  FileText,
  Filter,
} from 'lucide-react';
import type { UserSession } from '../components/LoginModal';
import type { CustomerOrder } from '../types/payment';
import { getCustomerOrders, getAdminOrders, adminVerifyUtr } from '../utils/paymentApi';

interface AccountPageProps {
  userSession: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenInventoryHud?: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  userSession,
  onOpenLogin,
  onLogout,
  onOpenInventoryHud,
}) => {
  const navigate = useNavigate();

  // Customer Orders State
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);

  // Admin Desk State
  const [adminOrders, setAdminOrders] = useState<CustomerOrder[]>([]);
  const [adminFilter, setAdminFilter] = useState<'all' | 'awaiting_utr' | 'captured' | 'cod'>('all');
  const [adminActionLoading, setAdminActionLoading] = useState<string | null>(null);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);

  const isAdmin = userSession?.role === 'ADMIN' || userSession?.role === 'IMS_ENGINEER';

  // Load customer orders
  const loadOrders = async () => {
    if (!userSession || !userSession.isLoggedIn) return;

    setIsLoadingOrders(true);
    try {
      const orders = await getCustomerOrders(userSession.email || userSession.memberId);
      setCustomerOrders(orders);

      if (isAdmin) {
        const all = await getAdminOrders(userSession.role);
        setAdminOrders(all);
      }
    } catch (err) {
      console.warn('Could not fetch orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [userSession]);

  // Admin action: Verify or reject UTR
  const handleAdminVerifyUtr = async (orderId: string, isApproved: boolean) => {
    if (!userSession) return;
    setAdminActionLoading(orderId);
    setAdminSuccessMsg(null);

    try {
      const updated = await adminVerifyUtr(
        orderId,
        isApproved,
        userSession.name,
        isApproved ? 'Verified against roastery bank statement' : 'Invalid / missing UTR reference'
      );

      setAdminSuccessMsg(
        isApproved
          ? `Order #${updated.orderNumber} successfully marked as PAID & VERIFIED.`
          : `Order #${updated.orderNumber} UTR rejected.`
      );

      // Refresh orders
      await loadOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setAdminActionLoading(null);
    }
  };

  const filteredAdminOrders = adminOrders.filter((ord) => {
    if (adminFilter === 'awaiting_utr') return ord.paymentStatus === 'awaiting_manual_verification';
    if (adminFilter === 'captured') return ord.paymentStatus === 'captured';
    if (adminFilter === 'cod') return ord.paymentMethod === 'cod';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-[#2D2926]/10 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </button>
          <div className="text-xs font-mono uppercase tracking-widest text-[#8C827A]">
            VIP Member Portal & Order Archives
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-8 pt-8 space-y-8">
        {!userSession?.isLoggedIn ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#2D2926]/10 p-8 shadow-sm">
            <div className="h-16 w-16 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center mx-auto mb-4 text-[#2D2926]">
              <User className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-display font-bold text-[#2D2926]">
              NOIR DAKSHIN COFFEE
            </h2>
            <p className="mt-2 text-sm text-[#8C827A] max-w-md mx-auto">
              Sign in to view your orders, past roast reservations, saved addresses, and profile details.
            </p>
            <button
              onClick={onOpenLogin}
              className="mt-6 px-8 py-3.5 rounded-full bg-[#2D2926] text-[#FAF7F5] font-bold text-sm hover:bg-black transition-colors shadow-lg cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Digital Membership Card */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1F1C1A] via-[#2D2926] to-[#0D0B0A] text-white p-6 sm:p-8 shadow-2xl border border-white/10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E05A7E]/10 rounded-full filter blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between h-52 sm:h-56">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xl sm:text-2xl tracking-wider text-[#FAF7F5]">
                        NOIR DAKSHIN
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F5DADF] text-[#2D2926] text-[10px] font-bold uppercase tracking-widest">
                        {userSession.role || 'CUSTOMER'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8C827A] font-mono mt-0.5">
                      EST. 1998 • CHIKMAGALUR & BABA BUDAN
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-[#F5DADF]" />
                </div>

                <div>
                  <div className="text-[11px] font-mono text-[#8C827A] uppercase tracking-widest">
                    Registered Coffee Member
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#FAF7F5]">
                    {userSession.name}
                  </div>
                </div>

                <div className="flex items-end justify-between border-t border-white/10 pt-3">
                  <div>
                    <div className="text-[10px] text-[#8C827A] font-mono">ACCOUNT ID</div>
                    <div className="text-sm font-mono font-bold text-[#F5DADF]">{userSession.memberId}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8C827A] font-mono">ACCOUNT EMAIL</div>
                    <div className="text-xs font-mono text-white/80">{userSession.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ADMIN ONLY: Roastery Order Management & Manual UTR Verification Desk */}
            {isAdmin && (
              <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/15 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D2926]/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
                      <h3 className="font-display font-bold text-lg text-[#2D2926]">
                        Roastery Order Management & Manual UTR Verification Desk
                      </h3>
                    </div>
                    <p className="text-xs text-[#5E5854] mt-0.5">
                      Authorized operator desk for reconciling direct static UPI QR payments and monitoring orders.
                    </p>
                  </div>

                  {onOpenInventoryHud && (
                    <button
                      onClick={onOpenInventoryHud}
                      className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-900 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Package className="h-4 w-4" />
                      <span>Launch IMS Stock HUD</span>
                    </button>
                  )}
                </div>

                {adminSuccessMsg && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    <span>{adminSuccessMsg}</span>
                  </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-[#8C827A] font-semibold flex items-center gap-1 mr-1">
                    <Filter className="h-3.5 w-3.5" /> Filter:
                  </span>
                  {(['all', 'awaiting_utr', 'captured', 'cod'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setAdminFilter(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        adminFilter === f
                          ? 'bg-[#2D2926] text-white shadow-xs'
                          : 'bg-[#FAF7F5] text-[#5E5854] border border-[#2D2926]/10 hover:text-[#2D2926]'
                      }`}
                    >
                      {f === 'all' && `All (${adminOrders.length})`}
                      {f === 'awaiting_utr' &&
                        `Awaiting UTR (${adminOrders.filter((o) => o.paymentStatus === 'awaiting_manual_verification').length})`}
                      {f === 'captured' &&
                        `Paid/Captured (${adminOrders.filter((o) => o.paymentStatus === 'captured').length})`}
                      {f === 'cod' &&
                        `COD (${adminOrders.filter((o) => o.paymentMethod === 'cod').length})`}
                    </button>
                  ))}
                </div>

                {/* Admin Orders Table / List */}
                <div className="space-y-3">
                  {filteredAdminOrders.length === 0 ? (
                    <div className="p-8 text-center bg-[#FAF7F5] rounded-2xl text-xs text-[#8C827A]">
                      No orders matching the selected filter.
                    </div>
                  ) : (
                    filteredAdminOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#2D2926]">{ord.orderNumber}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                ord.paymentStatus === 'captured'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ord.paymentStatus === 'awaiting_manual_verification'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-blue-100 text-blue-900'
                              }`}
                            >
                              {ord.paymentStatus}
                            </span>
                            <span className="text-xs font-mono text-[#8C827A]">• {ord.paymentMethod.toUpperCase()}</span>
                          </div>

                          <div className="text-xs text-[#5E5854]">
                            <strong>Customer:</strong> {ord.customerName} ({ord.customerEmail}) • {ord.customerPhone}
                          </div>

                          <div className="text-xs text-[#8C827A]">
                            <strong>Items ({ord.items.length}):</strong>{' '}
                            {ord.items.map((i) => `${i.name} (${i.quantity}x)`).join(', ')}
                          </div>

                          {ord.utrNumber && (
                            <div className="text-xs font-mono text-[#E05A7E] font-bold">
                              Submitted UTR: <span className="underline">{ord.utrNumber}</span> (Account: {ord.customQrId})
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-end md:items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-[#8C827A] block">TOTAL</span>
                            <span className="font-mono font-bold text-base text-[#2D2926]">
                              ₹{ord.pricing.finalTotal.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Action button if awaiting UTR verification */}
                          {ord.paymentStatus === 'awaiting_manual_verification' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAdminVerifyUtr(ord.id, true)}
                                disabled={adminActionLoading === ord.id}
                                className="px-3.5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {adminActionLoading === ord.id ? 'Processing...' : '✓ Approve & Mark Paid'}
                              </button>
                              <button
                                onClick={() => handleAdminVerifyUtr(ord.id, false)}
                                disabled={adminActionLoading === ord.id}
                                className="px-3 py-2 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                ✕ Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* CUSTOMER SECTION: MY ORDERS HISTORY */}
            <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#E05A7E]" />
                  <h3 className="font-display font-bold text-lg text-[#2D2926]">
                    My Orders & Roast History
                  </h3>
                </div>
                <button
                  onClick={loadOrders}
                  className="text-xs font-mono text-[#8C827A] hover:text-[#2D2926] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className={`h-3 w-3 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {isLoadingOrders ? (
                <div className="py-12 text-center text-xs text-[#8C827A] font-mono">
                  Loading your fresh roast reservations...
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center mx-auto text-[#8C827A]">
                    <Package className="h-6 w-6" />
                  </div>
                  <h4 className="font-display font-bold text-base text-[#2D2926]">No Orders Placed Yet</h4>
                  <p className="text-xs text-[#8C827A] max-w-sm mx-auto">
                    You have not placed any coffee orders with this account yet. Explore our single-estate collection to experience coffee roasted without compromise.
                  </p>
                  <button
                    onClick={() => navigate('/collection')}
                    className="px-6 py-2.5 rounded-full bg-[#2D2926] text-white text-xs font-bold hover:bg-black transition-colors cursor-pointer"
                  >
                    Explore Coffee Collection
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-3xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2D2926]/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#2D2926]">{ord.orderNumber}</span>
                          <span className="text-xs text-[#8C827A] font-mono">
                            • {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {ord.paymentStatus === 'captured' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Paid & Verified
                            </span>
                          ) : ord.paymentStatus === 'awaiting_manual_verification' ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-mono font-bold flex items-center gap-1">
                              <Clock className="h-3 w-3" /> Awaiting UTR Verification
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-mono font-bold flex items-center gap-1">
                              <Truck className="h-3 w-3" /> COD (Pay on Delivery)
                            </span>
                          )}

                          <span className="text-[11px] font-mono text-[#8C827A] uppercase bg-white px-2 py-0.5 rounded-full border border-[#2D2926]/10">
                            {ord.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8C827A] font-bold block mb-1">
                            Roasted Micro-Lots:
                          </span>
                          <div className="space-y-1">
                            {ord.items.map((it) => (
                              <div key={`${it.productId}-${it.grind}`} className="flex justify-between text-[#5E5854]">
                                <span>
                                  {it.name} ({it.quantity}x)
                                </span>
                                <span className="font-mono font-semibold">
                                  ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#8C827A] font-bold block mb-1">
                            Delivery Destination:
                          </span>
                          <div className="text-[#5E5854] leading-relaxed">
                            {ord.shippingAddress.address}, {ord.shippingAddress.city} - {ord.shippingAddress.postalCode}
                          </div>
                          {ord.utrNumber && (
                            <div className="font-mono text-[11px] text-[#E05A7E] font-semibold mt-1">
                              Submitted UTR: {ord.utrNumber}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#2D2926]/10 flex items-center justify-between text-xs">
                        <span className="text-[#8C827A] font-mono">
                          Status: <strong>{ord.fulfillmentStatus.toUpperCase()}</strong>
                        </span>
                        <div className="font-mono font-bold text-sm text-[#2D2926]">
                          Total: ₹{ord.pricing.finalTotal.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Details & Order Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Details */}
              <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-lg text-[#2D2926] flex items-center gap-2">
                  <User className="h-4 w-4 text-[#E05A7E]" />
                  Customer Profile
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#2D2926]/5">
                    <span className="text-[#8C827A]">Full Name:</span>
                    <span className="font-bold text-[#2D2926]">{userSession.name}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#2D2926]/5">
                    <span className="text-[#8C827A]">Email:</span>
                    <span className="font-bold text-[#2D2926]">{userSession.email}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#2D2926]/5">
                    <span className="text-[#8C827A]">Phone:</span>
                    <span className="font-bold text-[#2D2926]">{userSession.phone || 'Configured via SMS'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#2D2926]/5">
                    <span className="text-[#8C827A]">Membership Status:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Active Priority
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="w-full mt-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out from Session
                </button>
              </div>

              {/* Preferences & Restock Alerts */}
              <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-lg text-[#2D2926] flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#E05A7E]" />
                  Fresh Roast Alert Preferences
                </h3>
                <p className="text-xs text-[#5E5854]">
                  Receive alerts when fresh seasonal coffees (such as Nilgiri Geisha or Monsooned Malabar) are roasted.
                </p>
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 text-xs cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-[#2D2926]" />
                    <span>SMS / WhatsApp order updates with tracking</span>
                  </label>
                  <label className="flex items-center gap-3 text-xs cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-[#2D2926]" />
                    <span>Exclusive 48h advance access to Vault Releases</span>
                  </label>
                  <label className="flex items-center gap-3 text-xs cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-[#2D2926]" />
                    <span>Quarterly harvest cupping reports from Western Ghats</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
