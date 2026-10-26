import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Award, 
  LogOut,
  Bell,
  CheckCircle2,
  ShieldCheck,
  Package
} from 'lucide-react';
import type { UserSession } from '../components/LoginModal';

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

  return (
    <div className="min-h-screen bg-[#FAF7F5] text-[#2D2926] pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 border-b border-[#2D2926]/10 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F5] border border-[#2D2926]/15 text-xs font-semibold hover:bg-neutral-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Home</span>
          </button>
          <div className="text-xs font-mono uppercase tracking-widest text-[#8C827A]">
            VIP Member Portal & Archives
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-8 pt-8">
        {!userSession?.isLoggedIn ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#2D2926]/10 p-8 shadow-sm">
            <div className="h-16 w-16 rounded-full bg-[#FAF7F5] border border-[#2D2926]/10 flex items-center justify-center mx-auto mb-4 text-[#2D2926]">
              <User className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-display font-bold text-[#2D2926]">
              NOIR DAKSHIN MAISON
            </h2>
            <p className="mt-2 text-sm text-[#8C827A] max-w-md mx-auto">
              Sign in to access exclusive harvest pre-allocations, view authenticated certificate archives, and customize your roasting profiles.
            </p>
            <button
              onClick={onOpenLogin}
              className="mt-6 px-8 py-3.5 rounded-full bg-[#2D2926] text-[#FAF7F5] font-bold text-sm hover:bg-black transition-colors shadow-lg"
            >
              Sign In to Member Portal
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Digital VIP Membership Card */}
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
                        VIP ALLIANCE
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
                    Member Allocation Holder
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-bold tracking-tight text-[#FAF7F5]">
                    {userSession.name}
                  </div>
                </div>

                <div className="flex items-end justify-between border-t border-white/10 pt-3">
                  <div>
                    <div className="text-[10px] text-[#8C827A] font-mono">REGISTRY ID</div>
                    <div className="text-sm font-mono font-bold text-[#F5DADF]">{userSession.memberId}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8C827A] font-mono">CONTACT ALLOCATION</div>
                    <div className="text-xs font-mono text-white/80">{userSession.email}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Authorized Personnel IMS Control Center */}
            {(userSession.role === 'ADMIN' || userSession.role === 'IMS_ENGINEER') && (
              <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-300 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
                    <h3 className="font-display font-bold text-lg text-emerald-950">
                      Authorized Inventory Management Control
                    </h3>
                  </div>
                  <span className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-mono text-[10px] font-bold uppercase">
                    {userSession.role} PRIVILEGES ACTIVE
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  You are authenticated with full operator authorization. You can monitor stock thresholds, trigger automated restocking batches, and oversee real-time lot allocations across India.
                </p>
                {onOpenInventoryHud && (
                  <button
                    onClick={onOpenInventoryHud}
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-900 transition-colors shadow-sm cursor-pointer"
                  >
                    <Package className="h-4 w-4" />
                    <span>Launch Live IMS Control HUD</span>
                  </button>
                )}
              </div>
            )}

            {/* Member Details & Allocation Records */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Details */}
              <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-lg text-[#2D2926] flex items-center gap-2">
                  <User className="h-4 w-4 text-[#E05A7E]" />
                  Curator Profile
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
                  className="w-full mt-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out from Session
                </button>
              </div>

              {/* Preferences & Restock Alerts */}
              <div className="p-6 rounded-3xl bg-white border border-[#2D2926]/10 shadow-sm space-y-4">
                <h3 className="font-display font-bold text-lg text-[#2D2926] flex items-center gap-2">
                  <Bell className="h-4 w-4 text-[#E05A7E]" />
                  Allocation Alert Preferences
                </h3>
                <p className="text-xs text-[#5E5854]">
                  Receive immediate alerts when rare micro-lots (such as Nilgiri Geisha or Monsooned Malabar) are fresh-roasted.
                </p>
                <div className="space-y-3 pt-2">
                  <label className="flex items-center gap-3 text-xs cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-[#2D2926]" />
                    <span>SMS / WhatsApp dispatch notification with tracking</span>
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
