import React, { useState } from 'react';
import { 
  X, 
  Package, 
  RefreshCw, 
  AlertTriangle, 
  Plus, 
  Minus, 
  CheckCircle, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  UserCheck, 
  LogOut
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { NOIR_PRODUCTS } from '../data/products';

interface InventoryHudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryHudModal: React.FC<InventoryHudModalProps> = ({ isOpen, onClose }) => {
  const { 
    stockMap, 
    imsSession, 
    loginAsIMS, 
    logoutOfIMS, 
    getStockStatus, 
    setStockDirect, 
    restock, 
    resetAllToDefault 
  } = useInventory();

  // Auth form state
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [actionNotice, setActionNotice] = useState<string>('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const res = loginAsIMS(email, password);
    if (!res.success) {
      setAuthError(res.error || 'Access Denied: Invalid credentials.');
    } else {
      setEmail('');
      setPassword('');
      setActionNotice(`Authenticated as ${res.session?.role}: ${res.session?.name}`);
      setTimeout(() => setActionNotice(''), 3000);
    }
  };

  const handleSafeAction = (actionFn: () => void, description: string) => {
    try {
      actionFn();
      setActionNotice(description);
      setTimeout(() => setActionNotice(''), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      setAuthError(msg);
      setTimeout(() => setAuthError(''), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-[350] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF7F5] border border-[#2D2926]/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#2D2926]/10 flex items-center justify-between bg-white/90">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#2D2926] text-[#FAF7F5] flex items-center justify-center shadow-md">
              <Package className="h-5 w-5 text-[#F5DADF]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-display font-bold text-[#2D2926]">
                  Inventory Management System (IMS)
                </h2>
                {imsSession ? (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold">
                    <ShieldCheck className="h-3 w-3" /> {imsSession.role} AUTHENTICATED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono font-bold">
                    <Lock className="h-3 w-3" /> RESTRICTED ACCESS
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8C827A]">
                Strictly managed by Admin & IMS Engineer roles. Regular customers have read-only access.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {imsSession && (
              <button
                onClick={logoutOfIMS}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-mono font-medium transition-colors"
                title="Lock IMS and sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Lock IMS</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="h-9 w-9 rounded-full bg-neutral-200/70 hover:bg-neutral-300 text-[#2D2926] flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Global Notifications / Alert Banner */}
        {actionNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs font-mono font-bold text-emerald-800 flex items-center gap-2">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
        )}
        {authError && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2 text-xs font-mono font-bold text-rose-800 flex items-center gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            <span>{authError}</span>
          </div>
        )}

        {/* BODY AREA: Either Security Gate (if unauthenticated) or Management Grid (if authenticated) */}
        {!imsSession ? (
          <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8" />
            </div>

            <h3 className="text-2xl font-display font-bold text-[#2D2926]">
              Admin & IMS Engineer Authentication Required
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#5E5854] max-w-lg leading-relaxed">
              To guarantee zero inventory desync, all stock adjustments, restocking, and overrides are restricted strictly to verified <strong>Admin</strong> and <strong>IMS Engineer</strong> IDs. Customers cannot perform updates.
            </p>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="mt-6 w-full max-w-md text-left space-y-4 bg-white p-6 rounded-2xl border border-[#2D2926]/10 shadow-sm">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8C827A] font-bold mb-1">
                  IMS Personnel Email / ID:
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-[#8C827A]" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@noirroast.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2D2926]/20 text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8C827A] font-bold mb-1">
                  Security Passkey:
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[#8C827A]" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#2D2926]/20 text-xs font-sans text-[#2D2926] focus:outline-none focus:border-[#2D2926]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2D2926] text-[#FAF7F5] font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <UserCheck className="h-4 w-4" />
                <span>Verify Credentials & Unlock IMS</span>
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED MANAGEMENT HUD */
          <>
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {/* Personnel Header Banner */}
              <div className="p-3 rounded-2xl bg-white border border-[#2D2926]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium text-[#2D2926]">
                    Active Operator: <strong>{imsSession.name}</strong> ({imsSession.email})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {imsSession.role === 'ADMIN' && (
                    <button
                      onClick={() => handleSafeAction(() => resetAllToDefault(), 'Reset all inventory to factory defaults.')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2D2926]/15 text-xs font-mono font-medium text-[#2D2926] hover:bg-neutral-100 transition-colors"
                      title="Admin-only factory reset"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Reset Defaults
                    </button>
                  )}
                  <span className="px-2.5 py-1 rounded-full bg-[#F5DADF] text-[#2D2926] font-mono text-[10px] font-bold">
                    Role: {imsSession.role}
                  </span>
                </div>
              </div>

              {/* 10 Micro-Lot Inventory Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {NOIR_PRODUCTS.map((prod) => {
                  const stock = stockMap[prod.id] ?? 0;
                  const status = getStockStatus(prod.id);

                  return (
                    <div
                      key={prod.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        status === 'OUT_OF_STOCK'
                          ? 'bg-rose-50/70 border-rose-200'
                          : status === 'LOW_STOCK'
                          ? 'bg-amber-50/70 border-amber-200'
                          : 'bg-white border-[#2D2926]/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#E05A7E]">
                              LOT #{prod.num}
                            </span>
                            {status === 'OUT_OF_STOCK' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white flex items-center gap-1">
                                <AlertTriangle className="h-2.5 w-2.5" /> OUT OF STOCK
                              </span>
                            )}
                            {status === 'LOW_STOCK' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">
                                LOW STOCK ({stock} LEFT)
                              </span>
                            )}
                            {status === 'IN_STOCK' && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white flex items-center gap-1">
                                <CheckCircle className="h-2.5 w-2.5" /> IN STOCK
                              </span>
                            )}
                          </div>
                          <h4 className="font-display font-semibold text-sm text-[#2D2926] truncate mt-0.5">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] text-[#8C827A] truncate">
                            {prod.region} • {prod.price}
                          </p>
                        </div>

                        {/* Stock Controls */}
                        <div className="flex items-center gap-1 bg-[#FAF7F5] border border-[#2D2926]/10 p-1 rounded-lg">
                          <button
                            onClick={() =>
                              handleSafeAction(
                                () => setStockDirect(prod.id, Math.max(0, stock - 1)),
                                `Reduced ${prod.name} to ${Math.max(0, stock - 1)} units.`
                              )
                            }
                            disabled={stock <= 0}
                            className="h-7 w-7 rounded flex items-center justify-center text-[#2D2926] hover:bg-neutral-200 disabled:opacity-30 transition-colors"
                            title="Decrement by 1"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-mono font-bold text-sm w-8 text-center text-[#2D2926]">
                            {stock}
                          </span>
                          <button
                            onClick={() =>
                              handleSafeAction(
                                () => restock(prod.id, 1),
                                `Restocked ${prod.name} by +1 unit (total ${stock + 1}).`
                              )
                            }
                            className="h-7 w-7 rounded flex items-center justify-center text-[#2D2926] hover:bg-neutral-200 transition-colors"
                            title="Increment by 1"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Quick Action Bar */}
                      <div className="mt-3 pt-2.5 border-t border-[#2D2926]/5 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#8C827A] font-mono">
                          Allocation: {stock} units
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() =>
                              handleSafeAction(
                                () => restock(prod.id, 5),
                                `Restocked ${prod.name} by +5 units (total ${stock + 5}).`
                              )
                            }
                            className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-[#2D2926] font-mono text-[10px] font-semibold transition-colors"
                          >
                            +5 Units
                          </button>
                          <button
                            onClick={() =>
                              handleSafeAction(
                                () => setStockDirect(prod.id, 0),
                                `Set ${prod.name} to 0 (OUT OF STOCK).`
                              )
                            }
                            className="px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-800 font-mono text-[10px] font-semibold transition-colors"
                          >
                            Set 0 (Out of Stock)
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/90 border-t border-[#2D2926]/10 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5E5854]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Zero stock desync active • Atomic deduction locks enabled.</span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#2D2926] text-[#FAF7F5] font-semibold hover:bg-black transition-colors"
              >
                Close HUD
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
