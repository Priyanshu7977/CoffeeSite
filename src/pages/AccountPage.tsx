/**
 * Premium Coffee-Themed Customer Account & VIP Cellar Portal
 * Features Profile Editing, Saved Delivery Address Management, Previous Orders
 * with Real-Time Roast Tracking Timeline, One-Click Reorder, and Roastery Admin Desk.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Award,
  LogOut,
  CheckCircle2,
  ShieldCheck,
  Package,
  Clock,
  Truck,
  RotateCcw,
  Filter,
  MapPin,
  Plus,
  Trash2,
  Edit3,
  Coffee,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { CustomerOrder, OrderItemSnapshot } from '../types/payment';
import { getCustomerOrders, getAdminOrders, adminVerifyUtr } from '../utils/paymentApi';
import { isValidName, sanitizeName, sanitizePhone } from '../utils/validation';

interface AccountPageProps {
  onOpenLogin: () => void;
  onOpenInventoryHud?: () => void;
  onReorderItems?: (items: OrderItemSnapshot[]) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onOpenLogin,
  onOpenInventoryHud,
  onReorderItems,
}) => {
  const navigate = useNavigate();
  const {
    userSession,
    profile,
    updateProfileData,
    addSavedAddress,
    removeSavedAddress,
    logout,
  } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'profile' | 'addresses'>('overview');

  // Orders State
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all');

  // Admin Desk State
  const [adminOrders, setAdminOrders] = useState<CustomerOrder[]>([]);
  const [adminFilter, setAdminFilter] = useState<'all' | 'awaiting_utr' | 'captured' | 'cod'>('all');
  const [adminActionLoading, setAdminActionLoading] = useState<string | null>(null);
  const [adminSuccessMsg, setAdminSuccessMsg] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editGrind, setEditGrind] = useState<string>('Whole Bean');
  const [profileSaving, setProfileSaving] = useState<boolean>(false);
  const [profileMsg, setProfileMsg] = useState<string>('');

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [addrLabel, setAddrLabel] = useState<string>('Home');
  const [addrName, setAddrName] = useState<string>('');
  const [addrPhone, setAddrPhone] = useState<string>('');
  const [addrStreet, setAddrStreet] = useState<string>('');
  const [addrCity, setAddrCity] = useState<string>('Bengaluru');
  const [addrPostalCode, setAddrPostalCode] = useState<string>('560038');
  const [addrIsDefault, setAddrIsDefault] = useState<boolean>(true);
  const [addrSaving, setAddrSaving] = useState<boolean>(false);
  const [addrError, setAddrError] = useState<string>('');

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
    if (userSession) {
      const isPlaceholder =
        !userSession.name ||
        userSession.name.trim().toLowerCase() === 'patron' ||
        userSession.name.trim().toLowerCase() === 'user';
      setEditName(isPlaceholder ? '' : userSession.name);
      setEditPhone(userSession.phone || '');
      setEditGrind(profile?.preferences?.favoriteGrind || 'Whole Bean');
    }
  }, [userSession, profile]);

  // Admin UTR Verification
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

      await loadOrders();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setAdminActionLoading(null);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');

    if (!isValidName(editName)) {
      setProfileMsg('Please enter a valid full name.');
      return;
    }

    setProfileSaving(true);
    try {
      await updateProfileData({
        fullName: editName.trim(),
        phone: editPhone.trim(),
        preferences: {
          favoriteGrind: editGrind,
        },
      });
      setIsEditingProfile(false);
      setProfileMsg('Profile updated successfully.');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err: unknown) {
      setProfileMsg(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Save Address
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrError('');

    if (!addrStreet.trim() || addrStreet.trim().length < 5) {
      setAddrError('Please provide a complete delivery street address.');
      return;
    }
    if (!addrCity.trim()) {
      setAddrError('Please provide the city.');
      return;
    }
    if (!addrPostalCode.trim() || addrPostalCode.trim().length < 5) {
      setAddrError('Please provide a valid postal/PIN code.');
      return;
    }

    setAddrSaving(true);
    try {
      await addSavedAddress({
        label: addrLabel,
        fullName: addrName || userSession?.name || 'Customer',
        phone: addrPhone || userSession?.phone || '',
        street: addrStreet.trim(),
        city: addrCity.trim(),
        postalCode: addrPostalCode.trim(),
        country: 'India',
        isDefault: addrIsDefault,
      });

      setIsAddressModalOpen(false);
      // Reset
      setAddrStreet('');
      setAddrPostalCode('560038');
    } catch (err: unknown) {
      setAddrError(err instanceof Error ? err.message : 'Failed to save address.');
    } finally {
      setAddrSaving(false);
    }
  };

  // Delete Address
  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this delivery address?')) return;
    try {
      await removeSavedAddress(id);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to remove address.');
    }
  };

  // Reorder coffee items
  const handleReorder = (items: OrderItemSnapshot[]) => {
    if (onReorderItems) {
      onReorderItems(items);
    } else {
      navigate('/cart');
    }
  };

  // Filtered orders
  const filteredCustomerOrders = customerOrders.filter((ord) => {
    if (orderFilter === 'active') return ord.fulfillmentStatus !== 'delivered' && ord.fulfillmentStatus !== 'cancelled';
    if (orderFilter === 'delivered') return ord.fulfillmentStatus === 'delivered';
    return true;
  });

  const addresses = profile?.savedAddresses || userSession?.savedAddresses || [];

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pb-20">
      {/* Sub-Header (Safely positioned below global Navbar) */}
      <div className="pt-18 sm:pt-20 pb-3 sm:pb-3.5 px-4 sm:px-8 border-b border-[#2D2926]/10 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-[#F5DADF]/40 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Experience</span>
          </button>
          <div className="text-xs font-mono uppercase tracking-widest text-[#8C827A] font-semibold">
            Member Cellar & Order Archives
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 sm:px-8 pt-5 sm:pt-6 space-y-6">
        {!userSession?.isLoggedIn ? (
          /* Unauthenticated State */
          <div className="text-center py-16 bg-white rounded-3xl border border-[#2D2926]/10 p-8 shadow-xs">
            <div className="h-16 w-16 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center mx-auto mb-4 text-[#C89658]">
              <Coffee className="h-8 w-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2D2926]">
              NOIR DAKSHIN CELLAR
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#8C827A] max-w-md mx-auto leading-relaxed">
              Sign in to view your orders, past roast allocations, saved delivery destinations, and member privileges.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onOpenLogin}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#2D2926] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#C89658] transition-colors shadow-md cursor-pointer"
              >
                Sign In to Your Account
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-[#2D2926]/20 bg-white text-[#2D2926] font-bold text-xs uppercase tracking-widest hover:bg-[#FAF7F5] transition-colors cursor-pointer"
              >
                Create New Membership
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6 animate-fadeIn">
            {/* VIP Member Pass Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1F1C1A] via-[#2D2926] to-[#0D0B0A] text-white p-5 sm:p-6 shadow-xl border border-white/10">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#C89658]/15 rounded-full filter blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col justify-between min-h-[175px] sm:min-h-[185px]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-xl sm:text-2xl tracking-wider text-[#FAF7F5]">
                        NOIR DAKSHIN
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C89658] text-[#2D2926] text-[10px] font-bold uppercase tracking-widest">
                        {userSession.role || 'CUSTOMER'}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A69C94] font-mono mt-0.5">
                      CHIKMAGALUR & BABA BUDAN GIRI RANGE • EST. 1998
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-[#C89658]" />
                </div>

                <div className="my-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-mono text-[#A69C94] uppercase tracking-widest">
                      Account Profile
                    </div>
                    <div className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#FAF7F5] mt-0.5">
                      {(!userSession.name || userSession.name.trim().toLowerCase() === 'patron') ? 'User' : userSession.name}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C89658] text-[#2D2926] hover:bg-[#d8a86a] transition-all text-xs font-bold cursor-pointer self-start sm:self-auto shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Fill / Edit Profile</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                  <div>
                    <div className="text-[10px] text-[#A69C94] font-mono uppercase">Member ID</div>
                    <div className="text-sm font-mono font-bold text-[#C89658]">{userSession.memberId}</div>
                  </div>
                  <div className="max-w-[280px]">
                    <div className="text-[10px] text-[#A69C94] font-mono uppercase">Registered Account</div>
                    <div className="text-xs font-mono text-white/90 truncate">{userSession.email}</div>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-400/40 bg-rose-950/40 text-rose-200 hover:bg-rose-900/60 transition-colors text-[11px] font-mono cursor-pointer ml-auto sm:ml-0"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[#2D2926]/10 pb-2">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'orders', label: `Order History (${customerOrders.length})`, icon: Package },
                { id: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
                { id: 'profile', label: 'Profile Details (Fill / Edit)', icon: Coffee },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#2D2926] text-white shadow-xs'
                        : 'bg-white text-[#5E5854] border border-[#2D2926]/10 hover:text-[#2D2926]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {(!userSession.name ||
                  userSession.name.trim().toLowerCase() === 'patron' ||
                  userSession.name.trim().toLowerCase() === 'user') && (
                  <div className="p-4 sm:p-5 rounded-3xl bg-[#FAF7F5] border border-[#C89658]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#2D2926] text-[#C89658] flex items-center justify-center shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm sm:text-base text-[#2D2926]">
                          Complete Your User Profile
                        </h4>
                        <p className="text-xs text-[#5E5854] mt-0.5">
                          You are currently logged in with a default ID. Fill in your full name and brewing preferences to personalize your orders.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setIsEditingProfile(true);
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#2D2926] text-white hover:bg-[#C89658] transition-colors text-xs font-bold cursor-pointer shrink-0 self-start sm:self-auto shadow-sm"
                    >
                      Fill Profile Details
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-3xl bg-white border border-[#2D2926]/10 shadow-xs">
                    <span className="text-[10px] font-mono text-[#8C827A] uppercase tracking-wider block mb-1">
                      Total Orders Placed
                    </span>
                    <span className="text-2xl font-display font-bold text-[#2D2926]">
                      {customerOrders.length}
                    </span>
                    <p className="text-[11px] text-[#8C827A] mt-1">Directly sourced micro-lots</p>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-[#2D2926]/10 shadow-xs">
                    <span className="text-[10px] font-mono text-[#8C827A] uppercase tracking-wider block mb-1">
                      Saved Delivery Addresses
                    </span>
                    <span className="text-2xl font-display font-bold text-[#2D2926]">
                      {addresses.length}
                    </span>
                    <p className="text-[11px] text-[#8C827A] mt-1">Pre-filled at express checkout</p>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-[#2D2926]/10 shadow-xs">
                    <span className="text-[10px] font-mono text-[#8C827A] uppercase tracking-wider block mb-1">
                      Member Privilege Tier
                    </span>
                    <span className="text-base font-display font-bold text-[#C89658] flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Priority Roaster Access
                    </span>
                    <p className="text-[11px] text-[#8C827A] mt-1">Free express direct estate shipping</p>
                  </div>
                </div>

                {/* Latest Order Highlight */}
                {customerOrders.length > 0 && (
                  <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#C89658] font-bold block">
                          Most Recent Allocation
                        </span>
                        <h3 className="font-display font-bold text-lg text-[#2D2926]">
                          Order #{customerOrders[0].orderNumber}
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-[#C89658] hover:text-[#2D2926] flex items-center gap-1 cursor-pointer"
                      >
                        <span>View All Archives</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs space-y-1.5">
                      <p className="text-[#5E5854]">
                        <strong>Items:</strong> {customerOrders[0].items.map((i) => `${i.name} (${i.quantity}x)`).join(', ')}
                      </p>
                      <p className="text-[#5E5854]">
                        <strong>Total:</strong> ₹{customerOrders[0].pricing.finalTotal.toLocaleString('en-IN')} via{' '}
                        {customerOrders[0].paymentMethod.toUpperCase()}
                      </p>
                      <p className="text-[#5E5854]">
                        <strong>Fulfillment:</strong> {customerOrders[0].fulfillmentStatus.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: ORDER HISTORY */}
            {activeTab === 'orders' && (
              <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D2926]/10 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#2D2926]">Your Coffee Orders</h3>
                    <p className="text-xs text-[#5E5854]">
                      Track the journey from single-origin harvest to your morning brew.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex gap-2">
                    {(['all', 'active', 'delivered'] as const).map((filterKey) => (
                      <button
                        key={filterKey}
                        onClick={() => setOrderFilter(filterKey)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          orderFilter === filterKey
                            ? 'bg-[#2D2926] text-white'
                            : 'bg-[#FAF7F5] text-[#5E5854] border border-[#2D2926]/10 hover:text-[#2D2926]'
                        }`}
                      >
                        {filterKey === 'all' && 'All'}
                        {filterKey === 'active' && 'Active Roasts'}
                        {filterKey === 'delivered' && 'Delivered'}
                      </button>
                    ))}
                  </div>
                </div>

                {isLoadingOrders ? (
                  <div className="py-12 text-center text-xs text-[#8C827A] font-mono">
                    Retrieving your estate records from the roastery ledger...
                  </div>
                ) : filteredCustomerOrders.length === 0 ? (
                  /* Attractive Empty State */
                  <div className="py-16 text-center space-y-4">
                    <div className="h-16 w-16 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center mx-auto text-[#C89658]">
                      <Coffee className="h-8 w-8" />
                    </div>
                    <div className="max-w-md mx-auto">
                      <h4 className="font-display font-bold text-lg text-[#2D2926]">Your Coffee Cellar is Empty</h4>
                      <p className="text-xs text-[#8C827A] mt-1 leading-relaxed">
                        No previous allocations found. Explore our limited micro-lot harvests roasted fresh to order in Indiranagar.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/collection')}
                      className="px-6 py-2.5 rounded-full bg-[#2D2926] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#C89658] transition-colors shadow-sm cursor-pointer"
                    >
                      Explore Harvest Collection
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCustomerOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-3xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-4 hover:border-[#C89658]/40 transition-colors"
                      >
                        {/* Header Line */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2D2926]/10 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-[#2D2926]">#{ord.orderNumber}</span>
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

                        {/* Order Items Breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-[#8C827A] font-bold block mb-1">
                              Roasted Coffee Bags:
                            </span>
                            <div className="space-y-1.5">
                              {ord.items.map((it) => (
                                <div key={`${it.productId}-${it.grind}`} className="flex justify-between text-[#5E5854]">
                                  <span>
                                    {it.name} <span className="text-[10px] text-[#8C827A]">({it.grind})</span> × {it.quantity}
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
                              Delivery Address:
                            </span>
                            <div className="text-[#5E5854] leading-relaxed">
                              {ord.shippingAddress.address}, {ord.shippingAddress.city} - {ord.shippingAddress.postalCode}
                            </div>
                            {ord.utrNumber && (
                              <div className="font-mono text-[11px] text-[#C89658] font-semibold mt-1">
                                Submitted UTR: {ord.utrNumber}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Live Roast & Express Delivery Tracking Timeline */}
                        <div className="pt-3 border-t border-[#2D2926]/10">
                          <span className="text-[10px] font-mono uppercase text-[#8C827A] font-bold block mb-2">
                            Roasting & Dispatch Progress:
                          </span>
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                              1. Order Placed
                            </div>
                            <div
                              className={`p-1.5 rounded-lg font-bold border ${
                                ord.fulfillmentStatus === 'roasting' || ord.fulfillmentStatus === 'shipped' || ord.fulfillmentStatus === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-white/60 text-[#8C827A] border-[#2D2926]/10'
                              }`}
                            >
                              2. Batch Roast
                            </div>
                            <div
                              className={`p-1.5 rounded-lg font-bold border ${
                                ord.fulfillmentStatus === 'shipped' || ord.fulfillmentStatus === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-white/60 text-[#8C827A] border-[#2D2926]/10'
                              }`}
                            >
                              3. Out for Delivery
                            </div>
                            <div
                              className={`p-1.5 rounded-lg font-bold border ${
                                ord.fulfillmentStatus === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-white/60 text-[#8C827A] border-[#2D2926]/10'
                              }`}
                            >
                              4. Delivered
                            </div>
                          </div>
                        </div>

                        {/* Footer Action Bar */}
                        <div className="pt-2 border-t border-[#2D2926]/10 flex items-center justify-between text-xs">
                          <div className="font-mono font-bold text-sm text-[#2D2926]">
                            Total: ₹{ord.pricing.finalTotal.toLocaleString('en-IN')}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReorder(ord.items)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D2926] text-white text-[11px] font-semibold hover:bg-[#C89658] transition-colors cursor-pointer shadow-xs"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reorder Allocation</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#2D2926]/10 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#2D2926]">Saved Delivery Addresses</h3>
                    <p className="text-xs text-[#5E5854]">
                      Pre-fill your shipping destinations during coffee drops and checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAddrName(userSession.name);
                      setAddrPhone(userSession.phone);
                      setIsAddressModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#2D2926] text-white text-xs font-bold hover:bg-[#C89658] transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Destination</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center mx-auto text-[#8C827A]">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <h4 className="font-display font-bold text-sm text-[#2D2926]">No Saved Addresses</h4>
                    <p className="text-xs text-[#8C827A] max-w-sm mx-auto">
                      Save your home, office, or roastery studio address to breeze through checkout in one click.
                    </p>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="px-5 py-2 rounded-full bg-[#2D2926] text-white text-xs font-bold hover:bg-[#C89658] cursor-pointer"
                    >
                      Add First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-5 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 relative flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs font-bold uppercase text-[#2D2926] flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-[#C89658]" />
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-[#2D2926]">{addr.fullName}</p>
                          <p className="text-xs text-[#5E5854] mt-0.5 leading-relaxed">
                            {addr.street}, {addr.city} - {addr.postalCode}
                          </p>
                          <p className="text-xs text-[#8C827A] mt-1">{addr.phone}</p>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#2D2926]/5">
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-rose-700 hover:text-rose-900 p-1.5 text-xs flex items-center gap-1 cursor-pointer"
                            title="Delete address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: PROFILE & PREFERENCES */}
            {activeTab === 'profile' && (
              <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D2926]/10 pb-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#2D2926]">User Profile Details</h3>
                    <p className="text-xs text-[#5E5854]">
                      Fill in or update your contact details and default grind preferences for freshly roasted bags.
                    </p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#2D2926] text-white hover:bg-[#C89658] text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>
                        {!userSession.name ||
                        userSession.name.trim().toLowerCase() === 'patron' ||
                        userSession.name.trim().toLowerCase() === 'user'
                          ? 'Fill Profile Details'
                          : 'Edit Details'}
                      </span>
                    </button>
                  )}
                </div>

                {profileMsg && (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    {profileMsg}
                  </div>
                )}

                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-[11px] font-mono font-bold text-[#5E5854] uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value.replace(/[^A-Za-z\s]/g, ''))}
                        required
                        placeholder="Enter your full name (e.g. Priyanshu Singh)"
                        className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] p-2.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold text-[#5E5854] uppercase mb-1">
                        Mobile Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(sanitizePhone(e.target.value))}
                        placeholder="10-digit mobile number"
                        className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] p-2.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-bold text-[#5E5854] uppercase mb-1">
                        Favorite Brewing Method / Grind
                      </label>
                      <select
                        value={editGrind}
                        onChange={(e) => setEditGrind(e.target.value)}
                        className="w-full rounded-2xl border border-[#2D2926]/15 bg-[#FAF7F5] p-2.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="Whole Bean">Whole Bean (Roasted Fresh)</option>
                        <option value="Filter Fine (Brass Davarah)">South Indian Brass Filter Kaapi</option>
                        <option value="Medium Grind (V60 & Kalita)">V60 / Pour Over Medium</option>
                        <option value="Coarse Grind (French Press)">French Press Coarse</option>
                        <option value="Fine Grind (9-Bar Espresso)">9-Bar Espresso Fine</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="px-6 py-2.5 rounded-full bg-[#2D2926] text-white text-xs font-bold hover:bg-[#C89658] cursor-pointer disabled:opacity-50"
                      >
                        {profileSaving ? 'Saving...' : 'Save Profile Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-5 py-2.5 rounded-full border border-[#2D2926]/15 text-xs font-bold hover:bg-[#FAF7F5] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {(!userSession.name ||
                      userSession.name.trim().toLowerCase() === 'patron' ||
                      userSession.name.trim().toLowerCase() === 'user') && (
                      <div className="p-4 rounded-2xl bg-[#C89658]/10 border border-[#C89658]/30 text-[#2D2926] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span>
                          <strong>Profile Incomplete:</strong> Your profile name is currently set to default 'User'. Click <strong>Fill Profile Details</strong> to set your name.
                        </span>
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#2D2926] text-white text-xs font-bold hover:bg-[#C89658] cursor-pointer shrink-0 self-start sm:self-auto"
                        >
                          Fill Now
                        </button>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-2">
                        <div className="text-[10px] font-mono uppercase text-[#8C827A]">Customer Name</div>
                        <div className="text-sm font-bold text-[#2D2926]">
                          {!userSession.name ||
                          userSession.name.trim().toLowerCase() === 'patron' ||
                          userSession.name.trim().toLowerCase() === 'user'
                            ? 'User (Not filled yet)'
                            : userSession.name}
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-2">
                        <div className="text-[10px] font-mono uppercase text-[#8C827A]">Registered Account</div>
                        <div className="text-sm font-bold text-[#2D2926]">{userSession.email}</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-2">
                        <div className="text-[10px] font-mono uppercase text-[#8C827A]">Mobile Phone</div>
                        <div className="text-sm font-bold text-[#2D2926]">{userSession.phone || 'None recorded'}</div>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#FAF7F5] border border-[#2D2926]/10 space-y-2">
                        <div className="text-[10px] font-mono uppercase text-[#8C827A]">Default Grind Choice</div>
                        <div className="text-sm font-bold text-[#C89658]">
                          {profile?.preferences?.favoriteGrind || 'Whole Bean (Roasted Fresh)'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2 animate-fadeIn">
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

                {/* Admin Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#2D2926]/10 font-mono text-[#8C827A] uppercase">
                        <th className="py-2.5 px-3">Order #</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Method</th>
                        <th className="py-2.5 px-3">UTR / Ref</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Payment Status</th>
                        <th className="py-2.5 px-3 text-right">Verification Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2D2926]/5">
                      {adminOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#FAF7F5]/80 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-[#2D2926]">{ord.orderNumber}</td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-[#2D2926]">{ord.customerName}</div>
                            <div className="text-[11px] text-[#8C827A] font-mono">{ord.customerEmail}</div>
                          </td>
                          <td className="py-3 px-3 font-mono uppercase text-[11px] text-[#5E5854]">
                            {ord.paymentMethod}
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px]">
                            {ord.utrNumber ? (
                              <span className="font-bold text-[#C89658]">{ord.utrNumber}</span>
                            ) : (
                              <span className="text-[#8C827A]">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-[#2D2926]">
                            ₹{ord.pricing.finalTotal.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-3">
                            {ord.paymentStatus === 'captured' && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                                Paid
                              </span>
                            )}
                            {ord.paymentStatus === 'awaiting_manual_verification' && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                                Awaiting UTR
                              </span>
                            )}
                            {ord.paymentStatus === 'pending' && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-mono font-bold">
                                COD Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5">
                            {ord.paymentStatus === 'awaiting_manual_verification' && (
                              <>
                                <button
                                  onClick={() => handleAdminVerifyUtr(ord.id, true)}
                                  disabled={adminActionLoading === ord.id}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleAdminVerifyUtr(ord.id, false)}
                                  disabled={adminActionLoading === ord.id}
                                  className="px-2.5 py-1 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Saved Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D2926]/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#2D2926]/10 p-6 sm:p-8 shadow-2xl text-[#2D2926]">
            <button
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#5E5854] hover:text-[#2D2926] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#C89658]">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-display text-lg font-bold">Add Delivery Address</h3>
            </div>

            {addrError && (
              <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-800">
                {addrError}
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5E5854] uppercase mb-1">
                  Address Label
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Home', 'Office', 'Studio'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setAddrLabel(lbl)}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        addrLabel === lbl
                          ? 'border-[#2D2926] bg-[#2D2926] text-white'
                          : 'border-[#2D2926]/15 bg-[#FAF7F5] text-[#5E5854]'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5E5854] uppercase mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={addrName}
                  onChange={(e) => setAddrName(sanitizeName(e.target.value))}
                  placeholder="Kavita Iyer"
                  className="w-full rounded-xl border border-[#2D2926]/15 bg-[#FAF7F5] p-2.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-[#5E5854] uppercase mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  required
                  placeholder="Flat 402, Kaapi Residency, 12th Main"
                  className="w-full rounded-xl border border-[#2D2926]/15 bg-[#FAF7F5] p-2.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#5E5854] uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#2D2926]/15 bg-[#FAF7F5] p-2.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-[#5E5854] uppercase mb-1">
                    Postal / PIN Code
                  </label>
                  <input
                    type="text"
                    value={addrPostalCode}
                    onChange={(e) => setAddrPostalCode(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#2D2926]/15 bg-[#FAF7F5] p-2.5 text-xs text-[#2D2926] focus:border-[#C89658] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="defaultAddr"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="rounded border-[#2D2926]/20 text-[#2D2926] focus:ring-[#C89658] cursor-pointer"
                />
                <label htmlFor="defaultAddr" className="text-xs text-[#5E5854] cursor-pointer">
                  Set as default shipping destination
                </label>
              </div>

              <button
                type="submit"
                disabled={addrSaving}
                className="w-full rounded-2xl bg-[#2D2926] py-3 text-xs font-bold text-white hover:bg-[#C89658] transition-colors cursor-pointer disabled:opacity-50 mt-2"
              >
                {addrSaving ? 'Saving Destination...' : 'Save Address'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
