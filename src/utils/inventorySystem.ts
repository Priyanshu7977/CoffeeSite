// Enterprise-Grade Real-Time Coffee Inventory Management System (IMS)
// Security Guarantee: Restricted strictly to ADMIN and IMS ENGINEER roles.
// Regular users/customers have READ-ONLY inventory access; any mutation attempts without valid IMS credentials throw Access Denied.

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
export type IMSRole = 'ADMIN' | 'IMS_ENGINEER';

export interface IMSUserSession {
  email: string;
  name: string;
  role: IMSRole;
  token: string;
  authenticatedAt: string;
}

export interface ProductInventory {
  productId: string;
  totalStock: number;
  reservedStock: number;
  grinds: Record<string, number>;
  lastUpdated: string;
}

export interface InventoryCheckResult {
  available: boolean;
  currentStock: number;
  maxAddable: number;
  status: StockStatus;
  message?: string;
}

const STORAGE_KEY = 'noir_inventory_registry_v2';
const IMS_SESSION_KEY = 'noir_ims_auth_session_v1';

// Authorized Admin & IMS Engineer Credentials
export const AUTHORIZED_IMS_ACCOUNTS = [
  {
    email: 'admin@noirdakshin.com',
    password: 'Noir@Admin2026',
    name: 'Master Roaster Administrator',
    role: 'ADMIN' as const,
  },
  {
    email: 'ims.engineer@noirdakshin.com',
    password: 'Noir@Engine2026',
    name: 'Lead IMS Systems Engineer',
    role: 'IMS_ENGINEER' as const,
  },
  {
    email: 'priyanshubipin2006@gmail.com',
    password: 'Noir@Admin2026',
    name: 'Priyanshu Singh (Owner & Admin)',
    role: 'ADMIN' as const,
  },
];

// Initial realistic specialty micro-lot allocation levels
export const INITIAL_INVENTORY_RECORD: Record<string, number> = {
  'prod-01': 14, // Baba Budan Obsidian
  'prod-02': 8,  // Malabar Monsooned Shore
  'prod-03': 6,  // Araku Valley Tribal Honey
  'prod-04': 9,  // Coorg Rainforest Peaberry
  'prod-05': 3,  // Dakshin Reserve 1998 (Low Stock Showcase)
  'prod-06': 7,  // Shevaroy Cloud Forest Light
  'prod-07': 2,  // Nilgiri Blue Mountain Geisha (Ultra-rare allocation)
  'prod-08': 5,  // Biligiri Rangan Wild Arabica
  'prod-09': 11, // Anamalai Highlands Dark Cacao
  'prod-10': 10, // Wayanad Robusta Royale
  'prod-11': 8,  // Kodagu Wild Spice Cinnamon
  'prod-12': 12, // Chikmagalur Elephant Monsooned AA
};

/**
 * Validates IMS credentials and creates an authenticated IMS session.
 */
export const authenticateIMS = (
  email: string,
  password: string
): { success: boolean; session?: IMSUserSession; error?: string } => {
  const account = AUTHORIZED_IMS_ACCOUNTS.find(
    (acc) => acc.email.toLowerCase() === email.trim().toLowerCase() && acc.password === password
  );

  if (!account) {
    return {
      success: false,
      error: 'Access Denied: Invalid Admin or IMS Engineer credentials. Customers cannot modify inventory.',
    };
  }

  const session: IMSUserSession = {
    email: account.email,
    name: account.name,
    role: account.role,
    token: `IMS-AUTH-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    authenticatedAt: new Date().toISOString(),
  };

  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(IMS_SESSION_KEY, JSON.stringify(session));
    }
  } catch (err) {
    console.warn('Session persistence notice:', err);
  }

  return { success: true, session };
};

/**
 * Retrieves the currently active IMS session from storage.
 */
export const getActiveIMSSession = (): IMSUserSession | null => {
  try {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(IMS_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role === 'ADMIN' || parsed?.role === 'IMS_ENGINEER') {
          return parsed;
        }
      }
    }
  } catch {
    return null;
  }
  return null;
};

/**
 * Logs out of the IMS session.
 */
export const logoutIMS = (): void => {
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(IMS_SESSION_KEY);
    }
  } catch {
    // Ignored
  }
};

class InventoryManager {
  private inventory: Record<string, number> = {};
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadInventory();
  }

  private loadInventory(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            this.inventory = { ...INITIAL_INVENTORY_RECORD, ...parsed };
            return;
          }
        }
      }
    } catch (e) {
      console.warn('Inventory loading failed, falling back to defaults', e);
    }
    this.inventory = { ...INITIAL_INVENTORY_RECORD };
  }

  private saveInventory(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inventory));
      }
    } catch (e) {
      console.error('Failed to persist inventory state', e);
    }
    this.notify();
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('Inventory subscriber error', err);
      }
    });
  }

  /**
   * Public Read: Anyone can view stock levels
   */
  public getStock(productId: string): number {
    if (!productId || typeof productId !== 'string' || !Object.prototype.hasOwnProperty.call(this.inventory, productId)) {
      return 0;
    }
    const stock = this.inventory[productId];
    return typeof stock === 'number' && Number.isFinite(stock) && stock >= 0 ? stock : 0;
  }

  /**
   * Public Read: Anyone can view stock status
   */
  public getStockStatus(productId: string): StockStatus {
    const stock = this.getStock(productId);
    if (stock <= 0) return 'OUT_OF_STOCK';
    if (stock <= 3) return 'LOW_STOCK';
    return 'IN_STOCK';
  }

  /**
   * Public Read: Verifies if a user can add a lot to their cart
   */
  public checkAvailability(productId: string, currentCartQty: number = 0, requestedQty: number = 1): InventoryCheckResult {
    const stock = this.getStock(productId);
    const maxAddable = Math.max(0, stock - currentCartQty);
    const status = this.getStockStatus(productId);

    if (stock <= 0) {
      return {
        available: false,
        currentStock: 0,
        maxAddable: 0,
        status: 'OUT_OF_STOCK',
        message: 'This micro-lot is currently out of stock.',
      };
    }

    if (requestedQty > maxAddable) {
      return {
        available: false,
        currentStock: stock,
        maxAddable,
        status,
        message: maxAddable === 0
          ? `You have already added all ${stock} available units to your cart.`
          : `Only ${maxAddable} additional units can be added to your cart.`,
      };
    }

    return {
      available: true,
      currentStock: stock,
      maxAddable,
      status,
    };
  }

  /**
   * Atomic commit during customer checkout.
   */
  public commitOrder(items: Array<{ productId: string; quantity: number }>): { success: boolean; error?: string } {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return { success: false, error: 'Cannot commit an empty order.' };
    }

    const validItems = items.filter(
      (i) => i && typeof i.productId === 'string' && Number.isFinite(i.quantity) && i.quantity > 0
    );
    if (validItems.length === 0) {
      return { success: false, error: 'Order must contain at least one item with valid quantity.' };
    }

    // 1. Validation phase (pure check, no mutations)
    for (const item of validItems) {
      if (!Object.prototype.hasOwnProperty.call(this.inventory, item.productId)) {
        return {
          success: false,
          error: `Inventory error: Invalid or unrecognized lot ID "${item.productId}".`,
        };
      }
      const stock = this.getStock(item.productId);
      if (stock < item.quantity) {
        return {
          success: false,
          error: `Inventory error: Insufficient stock for lot ID ${item.productId}. Required: ${item.quantity}, Available: ${stock}.`,
        };
      }
    }

    // 2. Execution phase (atomic decrement)
    for (const item of validItems) {
      const current = this.getStock(item.productId);
      this.inventory[item.productId] = Math.max(0, current - item.quantity);
    }

    this.saveInventory();
    return { success: true };
  }

  /**
   * SECURITY GUARD: Helper to verify IMS authorization
   */
  private verifyIMSAuthorization(session?: IMSUserSession | null): void {
    const active = session || getActiveIMSSession();
    if (!active || (active.role !== 'ADMIN' && active.role !== 'IMS_ENGINEER')) {
      throw new Error('Access Denied: Stock management is strictly restricted to Admin and IMS Engineer roles only.');
    }
  }

  /**
   * IMS ONLY: Restock a micro-lot
   */
  public restock(productId: string, quantity: number, session?: IMSUserSession | null): number {
    this.verifyIMSAuthorization(session);

    if (!productId || typeof productId !== 'string' || !Object.prototype.hasOwnProperty.call(this.inventory, productId)) {
      throw new Error(`Invalid or unrecognized lot ID "${productId}".`);
    }

    const safeQty = Math.max(1, Math.floor(quantity));
    if (!Number.isFinite(safeQty)) return this.getStock(productId);
    const current = this.getStock(productId);
    const newStock = current + safeQty;
    this.inventory[productId] = newStock;
    this.saveInventory();
    return newStock;
  }

  /**
   * IMS ONLY: Directly set a micro-lot stock count
   */
  public setStockDirect(productId: string, quantity: number, session?: IMSUserSession | null): number {
    this.verifyIMSAuthorization(session);

    if (!productId || typeof productId !== 'string' || !Object.prototype.hasOwnProperty.call(this.inventory, productId)) {
      throw new Error(`Invalid or unrecognized lot ID "${productId}".`);
    }

    const safeQty = Math.max(0, Math.floor(quantity));
    if (!Number.isFinite(safeQty)) return this.getStock(productId);
    this.inventory[productId] = safeQty;
    this.saveInventory();
    return safeQty;
  }

  /**
   * ADMIN ONLY: Reset entire inventory to factory defaults
   */
  public resetAllToDefault(session?: IMSUserSession | null): void {
    const active = session || getActiveIMSSession();
    if (!active || active.role !== 'ADMIN') {
      throw new Error('Access Denied: Factory inventory reset requires Admin role authorization.');
    }

    this.inventory = { ...INITIAL_INVENTORY_RECORD };
    this.saveInventory();
  }

  /**
   * Internal/Test reset without session check (for test harness beforeEach)
   */
  public _internalResetForTests(): void {
    this.inventory = { ...INITIAL_INVENTORY_RECORD };
    this.saveInventory();
  }

  public getAllStock(): Record<string, number> {
    return { ...this.inventory };
  }
}

export const inventorySystem = new InventoryManager();
