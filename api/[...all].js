// src/server/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// src/data/products.ts
var NOIR_PRODUCTS = [
  {
    id: "prod-01",
    num: "01",
    name: "BABA BUDAN OBSIDIAN",
    origin: "India / Chikmagalur",
    region: "Mullayanagiri & Chandragiri Hills",
    altitude: "1,900m \u2014 2,100m ASL",
    process: "96h Anaerobic Slow Natural",
    roastLevel: "Medium-Light Omniroast",
    notes: ["Floral Jasmine", "Smoked Cardamom", "Bittersweet Mysore Cacao"],
    description: "Grown on the sacred slopes where the first 7 coffee seeds were planted in 1670. High-altitude shade-grown Arabica yielding ethereal floral perfumes and lingering cardamom warmth.",
    brewRecommendation: "South Indian Brass Filter or V60 Pour Over at 93\xB0C with a 1:16 ratio.",
    acidity: 90,
    body: 84,
    sweetness: 89,
    price: "\u20B92,800",
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&auto=format&fit=crop&q=85",
    badge: "Chikmagalur Heritage",
    year: "2026 Monsoon Harvest"
  },
  {
    id: "prod-02",
    num: "02",
    name: "MALABAR MONSOONED SHORE",
    origin: "India / Malabar Coast",
    region: "Wayanad & Mangalore Shorelines",
    altitude: "1,200m \u2014 1,500m ASL",
    process: "Coastal Monsoon Wind Cured",
    roastLevel: "Medium-Dark Espresso Roast",
    notes: ["Dark Chocolate", "Earthy Molasses", "Charred Malabar Oak"],
    description: "Exposed to Arabian Sea moisture-laden monsoon winds for 16 weeks. Low-acidity, thick syrupy mouthfeel with profound dark chocolate and spicy malt intensity.",
    brewRecommendation: "9-Bar Espresso or South Indian Filter Kaapi. Dose 19g in, 38g out in 28 seconds.",
    acidity: 52,
    body: 98,
    sweetness: 86,
    price: "\u20B92,400",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=85",
    badge: "Monsoon Cured",
    year: "2026 Monsoon Harvest"
  },
  {
    id: "prod-03",
    num: "03",
    name: "ARAKU VALLEY TRIBAL HONEY",
    origin: "India / Eastern Ghats",
    region: "Ananthagiri & Araku Highland Ridge",
    altitude: "1,400m \u2014 1,600m ASL",
    process: "Bio-Dynamic Pulped Honey",
    roastLevel: "Medium Roast",
    notes: ["Wild Forest Honey", "Roasted Cashew", "Mandarin Orange"],
    description: "Cultivated by indigenous tribal farmers in the red loam valleys of the Eastern Ghats. Sweet golden honey nectar balanced with delicate citrus and buttery toasted cashews.",
    brewRecommendation: "Aeropress or Kalita Wave. Infuse with 94\xB0C spring water for 3.5 minutes.",
    acidity: 68,
    body: 88,
    sweetness: 95,
    price: "\u20B92,600",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=85",
    badge: "Bio-Dynamic Micro-Lot",
    year: "2026 Harvest Crop"
  },
  {
    id: "prod-04",
    num: "04",
    name: "COORG RAINFOREST PEABERRY",
    origin: "India / Kodagu",
    region: "Madikeri & Brahmagiri Range",
    altitude: "1,500m \u2014 1,750m ASL",
    process: "Fully Washed Peaberry Selection",
    roastLevel: "Light-Medium Roast",
    notes: ["Black Fig", "Wild Green Cardamom", "Raw Jaggery Caramel"],
    description: "Rare single-bean Peaberry cherries hand-harvested beneath silver oak and pepper vine shade canopies in Kodagu. Vibrant fruit acids harmonized with rich jaggery sweetness.",
    brewRecommendation: "Chemex or French Press. Gentle 45-second bloom for maximum floral clarity.",
    acidity: 88,
    body: 82,
    sweetness: 91,
    price: "\u20B92,200",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop&q=85",
    badge: "Rainforest Peaberry",
    year: "2026 Harvest Crop"
  },
  {
    id: "prod-05",
    num: "05",
    name: "DAKSHIN RESERVE 1998",
    origin: "India / Master Blend",
    region: "Chikmagalur & Coorg Assemblage",
    altitude: "Master Tri-Terroir Selection",
    process: "Oak Cask & Anaerobic Fusion",
    roastLevel: "Signature Noir Roast",
    notes: ["Toasted Jaggery", "88% Dark Cacao", "Smoked Mysore Vanilla"],
    description: "The crowning jewel of NOIR DAKSHIN COFFEE since 1998. An unhurried blend of high-grown Karnataka Arabicas slow-roasted in cast-iron convection drums.",
    brewRecommendation: "Traditional Brass Davarah or Bottomless Portafilter. Unbroken 1:2 extraction.",
    acidity: 75,
    body: 96,
    sweetness: 93,
    price: "\u20B93,400",
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=800&auto=format&fit=crop&q=85",
    badge: "Dakshin Heritage",
    year: "Continuous Archive"
  },
  {
    id: "prod-06",
    num: "06",
    name: "SHEVAROY CLOUD FOREST LIGHT",
    origin: "India / Yercaud Hills",
    region: "Shevaroy Mountain Ridge",
    altitude: "1,550m \u2014 1,700m ASL",
    process: "Thermal Shock Extended Washed",
    roastLevel: "Nordic Light Roast",
    notes: ["Bergamot Blossom", "White Peach", "Coriander Seed"],
    description: "Crisp high-plateau micro-lot kissed by cool mountain mists. Complex tea-like body with vibrant stone fruit luminosity and lingering honeysuckle finish.",
    brewRecommendation: "Fellow Stagg X or V60 Pour Over at 92\xB0C with soft mineral water.",
    acidity: 94,
    body: 72,
    sweetness: 90,
    price: "\u20B92,500",
    image: "https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?w=800&auto=format&fit=crop&q=85",
    badge: "Cloud Forest Edition",
    year: "2026 Spring Lot"
  },
  {
    id: "prod-07",
    num: "07",
    name: "NILGIRI BLUE MOUNTAIN GEISHA",
    origin: "India / Nilgiris",
    region: "Doddabetta Cloud Slopes",
    altitude: "2,000m \u2014 2,250m ASL",
    process: "Carbonic Maceration 120h",
    roastLevel: "Ultra-Light Floral Omniroast",
    notes: ["Jasmine Perfume", "Meyer Lemon", "Wild Raspberry"],
    description: "One of the highest altitude specialty micro-lots on the subcontinent. Rare Geisha varietal cold-fermented in pressurized stainless tanks for peerless elegance.",
    brewRecommendation: "V60 or Origami dripper. Clean 1:17 brew ratio with zero agitation.",
    acidity: 96,
    body: 76,
    sweetness: 97,
    price: "\u20B93,800",
    image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=800&auto=format&fit=crop&q=85",
    badge: "Reserve Geisha Micro-Lot",
    year: "2026 Limited Roast"
  },
  {
    id: "prod-08",
    num: "08",
    name: "BILIGIRI RANGAN WILD ARABICA",
    origin: "India / BR Hills",
    region: "Tiger Sanctuary Canopy",
    altitude: "1,750m \u2014 1,950m ASL",
    process: "Wild Yeast Double Fermentation",
    roastLevel: "Medium-Light Roast",
    notes: ["Passion Fruit", "Toasted Hazelnut", "Wild Clover Honey"],
    description: "Harvested inside the protected forest reserves of Karnataka. Native wild yeasts yield a striking balance of tropical fruit vibrancy and rich nutty warmth.",
    brewRecommendation: "Siphon or Aeropress inverted. 2-minute steep for deep aromatic extraction.",
    acidity: 84,
    body: 86,
    sweetness: 92,
    price: "\u20B92,900",
    image: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=800&auto=format&fit=crop&q=85",
    badge: "Sanctuary Harvest",
    year: "2026 Autumn Lot"
  },
  {
    id: "prod-09",
    num: "09",
    name: "ANAMALAI HIGHLANDS DARK CACAO",
    origin: "India / Tamil Nadu",
    region: "Valparai Plateau",
    altitude: "1,350m \u2014 1,550m ASL",
    process: "Slow Sun-Dried Natural",
    roastLevel: "Dark Convection Roast",
    notes: ["90% Dark Chocolate", "Roasted Almond", "Molasses Fudge"],
    description: "Intercropped with heritage heirloom cacao trees in the high rainforest ranges. Heavy-bodied, velvety, and naturally sweet with zero astringency.",
    brewRecommendation: "Moka Pot or Espresso. Produces thick, tiger-striped golden crema.",
    acidity: 48,
    body: 98,
    sweetness: 88,
    price: "\u20B92,300",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=85",
    badge: "Estate Cacao Terroir",
    year: "2026 Harvest Crop"
  },
  {
    id: "prod-10",
    num: "10",
    name: "WAYANAD ROBUSTA ROYALE",
    origin: "India / Kerala",
    region: "Wayanad High Highlands",
    altitude: "1,100m \u2014 1,300m ASL",
    process: "Oak Barrel Matured Natural",
    roastLevel: "Medium-Dark Roast",
    notes: ["Toasted Oak", "Bourbon Vanilla", "Spiced Tobacco Leaf"],
    description: "Hand-picked specialty grade Canephora aged in charred oak casks for 90 days. Exceptional crema production with whiskey-barrel richness and bold spice depth.",
    brewRecommendation: "Traditional South Indian Brass Filter. 80:20 blend with Baba Budan Obsidian.",
    acidity: 42,
    body: 100,
    sweetness: 85,
    price: "\u20B92,100",
    image: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=800&auto=format&fit=crop&q=85",
    badge: "Barrel Aged Canephora",
    year: "2026 Barrel Reserve"
  },
  {
    id: "prod-11",
    num: "11",
    name: "KODAGU WILD SPICE CINNAMON",
    origin: "India / Coorg",
    region: "Virajpet & Kutta Valley",
    altitude: "1,450m \u2014 1,650m ASL",
    process: "Extended Natural Anaerobic 72h",
    roastLevel: "Medium Convection Roast",
    notes: ["Ceylon Cinnamon", "Spiced Damson Plum", "Raw Demerara Sugar"],
    description: "Interplanted alongside wild Ceylon cinnamon and clove groves in Southern Coorg. Slow sun-dried on bamboo African raised beds yielding comforting holiday baker spice warmth and rich stone fruit sweetness.",
    brewRecommendation: "Pour Over (Kalita Wave or V60) at 93\xB0C or Moka Pot. Dose 18g with a 1:16 ratio.",
    acidity: 78,
    body: 88,
    sweetness: 94,
    price: "\u20B92,450",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=85",
    badge: "Spice Canopy Terroir",
    year: "2026 Winter Harvest"
  },
  {
    id: "prod-12",
    num: "12",
    name: "CHIKMAGALUR ELEPHANT MONSOONED AA",
    origin: "India / Bababudangiri",
    region: "Chandragiri Foothills",
    altitude: "1,600m \u2014 1,850m ASL",
    process: "Double Washed Elephant Screen 20+",
    roastLevel: "Medium-Dark Velvet Roast",
    notes: ["Glazed Walnut", "72% Dark Chocolate", "Nutmeg Crema"],
    description: "Ultra-rare massive Screen 20+ Elephant beans hand-graded from ancient shade-grown Arabica trees. Immense syrupy body with sweet roasted walnut, prolonged dark cacao, and a dense, persistent tiger-stripe crema.",
    brewRecommendation: "Traditional South Indian Brass Davarah or Lever Espresso at 9-bar pressure.",
    acidity: 62,
    body: 97,
    sweetness: 91,
    price: "\u20B92,650",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=85",
    badge: "Elephant Screen 20+",
    year: "2026 Micro-Harvest"
  }
];

// src/server/pricing.ts
var AUTHORITATIVE_CATALOG_PRICES = {};
NOIR_PRODUCTS.forEach((prod) => {
  const numeric = parseFloat(prod.price.replace(/[^0-9.]/g, "")) || 2400;
  AUTHORITATIVE_CATALOG_PRICES[prod.id] = {
    name: prod.name,
    origin: `${prod.num} \u2022 ${prod.origin}`,
    priceRupees: Math.round(numeric)
  };
});
var VALID_DISCOUNT_PROMOS = {
  FIRST10: 10,
  // 10% Off 1st-Time Customer Promo
  WELCOME10: 10,
  // 10% Off Welcome Promo
  BANK15: 15,
  // 15% Off UPI & Bank Payment Promo
  UPI15: 15,
  // 15% Off UPI Payment Promo
  ROAST20: 20,
  // 20% Off Connoisseur Roasts Promo
  NOIR20: 20,
  // 20% Off Specialty Estate Micro-Lots
  NOIRVIP10: 10,
  // 10% Off 48h Cart Urgency Promo
  NOIR10: 10,
  // 10% Off Welcome Promo
  VIP10: 10,
  // 10% Off Member Privilege Promo
  COFFEE20: 20,
  // 20% Off Connoisseur Promo
  FIRSTROAST: 10
  // 10% Off First Roast Promo
};
function calculateAuthoritativeValuation(incomingItems, discountCode, paymentMethod) {
  if (!incomingItems || !Array.isArray(incomingItems) || incomingItems.length === 0) {
    return {
      isValid: false,
      error: "Cannot calculate valuation for empty or missing cart items.",
      items: [],
      pricing: {
        subtotal: 0,
        discountAmount: 0,
        shippingCost: 0,
        finalTotal: 0,
        amountInPaise: 0,
        currency: "INR"
      }
    };
  }
  const validatedItems = [];
  let subtotal = 0;
  for (const item of incomingItems) {
    if (!item || typeof item.productId !== "string") {
      return {
        isValid: false,
        error: "Invalid item payload detected.",
        items: [],
        pricing: {
          subtotal: 0,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 0,
          amountInPaise: 0,
          currency: "INR"
        }
      };
    }
    const catalogRecord = AUTHORITATIVE_CATALOG_PRICES[item.productId];
    if (!catalogRecord) {
      return {
        isValid: false,
        error: `Unrecognized product lot ID: ${item.productId}.`,
        items: [],
        pricing: {
          subtotal: 0,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 0,
          amountInPaise: 0,
          currency: "INR"
        }
      };
    }
    const safeQty = Math.floor(item.quantity);
    if (!Number.isFinite(safeQty) || safeQty <= 0 || safeQty > 50) {
      return {
        isValid: false,
        error: `Invalid quantity (${item.quantity}) for product ${catalogRecord.name}. Must be between 1 and 50.`,
        items: [],
        pricing: {
          subtotal: 0,
          discountAmount: 0,
          shippingCost: 0,
          finalTotal: 0,
          amountInPaise: 0,
          currency: "INR"
        }
      };
    }
    const isSub = Boolean(item.isSubscription);
    const unitPrice = isSub ? Math.round(catalogRecord.priceRupees * 0.9) : catalogRecord.priceRupees;
    const lineTotal = unitPrice * safeQty;
    subtotal += lineTotal;
    validatedItems.push({
      productId: item.productId,
      name: isSub ? `${catalogRecord.name} (Roaster's Club Subscription)` : catalogRecord.name,
      origin: catalogRecord.origin,
      grind: item.grind?.trim() || "Filter Fine (Brass Davarah)",
      quantity: safeQty,
      unitPrice,
      lineTotal
    });
  }
  let discountAmount = 0;
  let appliedCode = void 0;
  if (discountCode && typeof discountCode === "string") {
    const cleanCode = discountCode.trim().toUpperCase();
    const isBankPromoOnCod = paymentMethod === "cod" && (cleanCode === "BANK15" || cleanCode === "UPI15");
    if (!isBankPromoOnCod && Object.prototype.hasOwnProperty.call(VALID_DISCOUNT_PROMOS, cleanCode)) {
      const percent = VALID_DISCOUNT_PROMOS[cleanCode];
      discountAmount = Math.round(subtotal * percent / 100);
      appliedCode = cleanCode;
    }
  }
  const shippingCost = 0;
  const codFee = paymentMethod === "cod" ? 100 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost + codFee);
  const amountInPaise = finalTotal * 100;
  return {
    isValid: true,
    items: validatedItems,
    pricing: {
      subtotal,
      discountAmount,
      discountCode: appliedCode,
      shippingCost,
      codFee,
      finalTotal,
      amountInPaise,
      currency: "INR"
    }
  };
}

// src/server/ordersStore.ts
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
function getOrdersFilePath() {
  try {
    const localDir = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, "orders.json");
  } catch {
    const tmpDir = path.join(os.tmpdir(), "noir-dakshin-orders");
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
    } catch {
    }
    return path.join(tmpDir, "orders.json");
  }
}
var ordersCache = /* @__PURE__ */ new Map();
function loadOrdersFromDisk() {
  try {
    const filePath = getOrdersFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      if (raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          ordersCache = new Map(parsed.map((o) => [o.id, o]));
          return;
        }
      }
    }
  } catch (err) {
    console.warn("Orders storage read notice (in-memory active):", err);
  }
}
function persistOrdersToDisk() {
  try {
    const filePath = getOrdersFilePath();
    const list = Array.from(ordersCache.values());
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("Orders persistence notice (in-memory active):", err);
  }
}
loadOrdersFromDisk();
var OrdersStore = class {
  /**
   * Creates or updates an order in the database
   */
  static saveOrder(order) {
    const updatedOrder = {
      ...order,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    ordersCache.set(order.id, updatedOrder);
    persistOrdersToDisk();
    return updatedOrder;
  }
  /**
   * Retrieves an order by internal UUID
   */
  static getOrderById(id) {
    return ordersCache.get(id) || null;
  }
  /**
   * Retrieves an order by public Order Number (e.g. NR-2026-8942)
   */
  static getOrderByNumber(orderNumber) {
    for (const order of ordersCache.values()) {
      if (order.orderNumber === orderNumber) {
        return order;
      }
    }
    return null;
  }
  /**
   * Retrieves an order by Razorpay Order ID (e.g. order_O123456789)
   */
  static getOrderByRazorpayOrderId(rzpOrderId) {
    if (!rzpOrderId) return null;
    for (const order of ordersCache.values()) {
      if (order.razorpayOrderId === rzpOrderId) {
        return order;
      }
    }
    return null;
  }
  /**
   * Idempotently updates order payment status and gateway transaction details
   */
  static updateOrderPayment(orderId, updates) {
    const existing = this.getOrderById(orderId);
    if (!existing) return null;
    if (existing.paymentStatus === "captured" && updates.paymentStatus !== "captured" && updates.paymentStatus !== "refunded") {
      return existing;
    }
    const merged = {
      ...existing,
      paymentStatus: updates.paymentStatus,
      razorpayPaymentId: updates.razorpayPaymentId || existing.razorpayPaymentId,
      razorpaySignature: updates.razorpaySignature || existing.razorpaySignature,
      utrNumber: updates.utrNumber || existing.utrNumber,
      customQrId: updates.customQrId || existing.customQrId,
      adminVerification: updates.adminVerification || existing.adminVerification,
      fulfillmentStatus: updates.fulfillmentStatus || existing.fulfillmentStatus,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return this.saveOrder(merged);
  }
  /**
   * Retrieves all orders belonging to a customer
   * STRICT ACCESS CONTROL: Customers only see their own email, memberId, or phone orders
   */
  static getCustomerOrders(identifier, phoneQuery) {
    const clean = identifier ? identifier.trim().toLowerCase() : "";
    const cleanPhone = phoneQuery ? phoneQuery.replace(/[^0-9]/g, "") : "";
    if (!clean && !cleanPhone) return [];
    const results = [];
    for (const order of ordersCache.values()) {
      const matchEmail = clean && order.customerEmail.toLowerCase() === clean;
      const matchCustomer = clean && order.customerId && order.customerId.toLowerCase() === clean;
      const orderPhone = order.customerPhone ? order.customerPhone.replace(/[^0-9]/g, "") : "";
      const matchPhone = cleanPhone && orderPhone && (orderPhone.endsWith(cleanPhone.slice(-10)) || cleanPhone.endsWith(orderPhone.slice(-10)));
      if (matchEmail || matchCustomer || matchPhone) {
        results.push(order);
      }
    }
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  /**
   * Admin Only: Returns all registered orders
   */
  static getAllOrders() {
    return Array.from(ordersCache.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  /**
   * Admin Only: Approves or rejects custom UPI UTR payment
   */
  static verifyUtr(orderId, verifiedBy, isApproved, notes) {
    const order = this.getOrderById(orderId);
    if (!order) return null;
    const verificationRecord = {
      status: isApproved ? "verified" : "rejected",
      verifiedBy,
      verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
      adminNotes: notes || (isApproved ? "UTR verified against bank statement" : "UTR rejected: Transaction not found")
    };
    return this.updateOrderPayment(orderId, {
      paymentStatus: isApproved ? "captured" : "failed",
      fulfillmentStatus: isApproved ? "roasting" : "unfulfilled",
      adminVerification: verificationRecord
    });
  }
  /**
   * Reset store (for testing purposes)
   */
  static resetForTesting() {
    ordersCache.clear();
  }
};

// src/server/usersStore.ts
import fs2 from "node:fs";
import path2 from "node:path";
import os2 from "node:os";

// src/server/authSecurity.ts
import crypto from "node:crypto";
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return {
    salt,
    hash: derivedKey.toString("hex")
  };
}
function verifyPassword(password, salt, storedHash) {
  try {
    const derivedKey = crypto.scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(storedHash, "hex");
    if (derivedKey.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(derivedKey, storedBuffer);
  } catch {
    return false;
  }
}
function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}
var rateLimitRegistry = /* @__PURE__ */ new Map();
function checkRateLimit(key, maxAttempts = 5, windowMs = 15 * 60 * 1e3) {
  const now = Date.now();
  const entry = rateLimitRegistry.get(key);
  if (!entry || entry.resetAt <= now) {
    rateLimitRegistry.set(key, { attempts: 1, resetAt: now + windowMs });
    return { allowed: true, remainingAttempts: maxAttempts - 1 };
  }
  if (entry.attempts >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1e3);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }
  entry.attempts += 1;
  return { allowed: true, remainingAttempts: maxAttempts - entry.attempts };
}
function resetRateLimit(key) {
  rateLimitRegistry.delete(key);
}
var DUMMY_SALT = crypto.randomBytes(16).toString("hex");
var DUMMY_HASH = crypto.scryptSync("dummy_timing_mitigation_password", DUMMY_SALT, 64).toString("hex");
function performDummyPasswordVerification(password) {
  try {
    const derivedKey = crypto.scryptSync(password || "dummy", DUMMY_SALT, 64);
    const storedBuffer = Buffer.from(DUMMY_HASH, "hex");
    crypto.timingSafeEqual(derivedKey, storedBuffer);
  } catch {
  }
}
function checkLoginRateLimit(clientIp, email) {
  const cleanIp = (clientIp || "unknown").trim().toLowerCase();
  const cleanEmail = (email || "unknown").trim().toLowerCase();
  const ipCheck = checkRateLimit(`login_ip_${cleanIp}`, 10, 15 * 60 * 1e3);
  if (!ipCheck.allowed) {
    const minutes = Math.max(1, Math.ceil((ipCheck.retryAfterSeconds || 60) / 60));
    return {
      allowed: false,
      error: `Too many sign-in attempts from your network. Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`,
      retryAfterSeconds: ipCheck.retryAfterSeconds
    };
  }
  if (cleanEmail && cleanEmail !== "unknown") {
    const acctCheck = checkRateLimit(`login_acct_${cleanEmail}`, 5, 15 * 60 * 1e3);
    if (!acctCheck.allowed) {
      const minutes = Math.max(1, Math.ceil((acctCheck.retryAfterSeconds || 60) / 60));
      return {
        allowed: false,
        error: `Too many failed sign-in attempts for this account. Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`,
        retryAfterSeconds: acctCheck.retryAfterSeconds
      };
    }
  }
  return { allowed: true };
}
function resetLoginRateLimit(clientIp, email) {
  const cleanIp = (clientIp || "unknown").trim().toLowerCase();
  const cleanEmail = (email || "unknown").trim().toLowerCase();
  resetRateLimit(`login_ip_${cleanIp}`);
  if (cleanEmail && cleanEmail !== "unknown") {
    resetRateLimit(`login_acct_${cleanEmail}`);
  }
}
function cleanupExpiredRateLimits() {
  const now = Date.now();
  for (const [key, entry] of rateLimitRegistry.entries()) {
    if (entry.resetAt <= now) {
      rateLimitRegistry.delete(key);
    }
  }
}
if (typeof setInterval !== "undefined") {
  const timer = setInterval(cleanupExpiredRateLimits, 5 * 60 * 1e3);
  if (timer.unref) timer.unref();
}

// src/server/usersStore.ts
function getUsersFilePath() {
  try {
    const localDir = path2.resolve(process.cwd(), "data");
    if (!fs2.existsSync(localDir)) {
      fs2.mkdirSync(localDir, { recursive: true });
    }
    return path2.join(localDir, "users.json");
  } catch {
    const tmpDir = path2.join(os2.tmpdir(), "noir-roast-data");
    try {
      if (!fs2.existsSync(tmpDir)) {
        fs2.mkdirSync(tmpDir, { recursive: true });
      }
    } catch {
    }
    return path2.join(tmpDir, "users.json");
  }
}
var usersCache = /* @__PURE__ */ new Map();
var sessionsCache = /* @__PURE__ */ new Map();
function loadUsersFromDisk() {
  try {
    const filePath = getUsersFilePath();
    if (fs2.existsSync(filePath)) {
      const raw = fs2.readFileSync(filePath, "utf-8");
      if (raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          usersCache = new Map(
            parsed.map((entry) => {
              if ("uid" in entry && !("profile" in entry)) {
                return [entry.email.toLowerCase(), { profile: entry }];
              }
              return [entry.profile.email.toLowerCase(), entry];
            })
          );
        }
      }
    }
  } catch (err) {
    console.warn("Users storage read notice (in-memory active):", err);
  }
}
function persistUsersToDisk() {
  try {
    const filePath = getUsersFilePath();
    const list = Array.from(usersCache.values());
    fs2.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("Users persistence notice (in-memory active):", err);
  }
}
loadUsersFromDisk();
var UsersStore = class {
  /**
   * Retrieves a customer profile by email (never exposes password hashes)
   */
  static getUserByEmail(email) {
    const record = usersCache.get(email.toLowerCase().trim());
    return record ? record.profile : void 0;
  }
  /**
   * Internal retrieval with cryptographic password credentials
   */
  static getUserRecord(email) {
    return usersCache.get(email.toLowerCase().trim());
  }
  /**
   * Retrieves a user by their UID or Member ID
   */
  static getUserById(identifier) {
    const clean = identifier.trim().toLowerCase();
    for (const record of usersCache.values()) {
      const u = record.profile;
      if (u.uid.toLowerCase() === clean || u.memberId.toLowerCase() === clean || u.email.toLowerCase() === clean) {
        return u;
      }
    }
    return void 0;
  }
  /**
   * Saves or registers a new customer profile with optional password salt and hash
   */
  static saveUserWithCredentials(profile, passwordSalt, passwordHash) {
    profile.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const record = {
      profile,
      passwordSalt,
      passwordHash
    };
    usersCache.set(profile.email.toLowerCase().trim(), record);
    persistUsersToDisk();
    return profile;
  }
  /**
   * Legacy wrapper for saveUser
   */
  static saveUser(user) {
    return this.saveUserWithCredentials(user);
  }
  /**
   * Updates an existing profile
   */
  static updateUser(email, updates) {
    const existingRecord = usersCache.get(email.toLowerCase().trim());
    if (!existingRecord) return void 0;
    const updatedProfile = {
      ...existingRecord.profile,
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    existingRecord.profile = updatedProfile;
    usersCache.set(email.toLowerCase().trim(), existingRecord);
    persistUsersToDisk();
    return updatedProfile;
  }
  /**
   * Adds a delivery address to the customer's profile
   */
  static addAddress(email, address) {
    const user = this.getUserByEmail(email);
    if (!user) return void 0;
    const currentAddresses = user.savedAddresses || [];
    if (address.isDefault) {
      currentAddresses.forEach((a) => a.isDefault = false);
    } else if (currentAddresses.length === 0) {
      address.isDefault = true;
    }
    const updatedAddresses = [...currentAddresses, address];
    return this.updateUser(email, { savedAddresses: updatedAddresses });
  }
  /**
   * Deletes a delivery address
   */
  static deleteAddress(email, addressId) {
    const user = this.getUserByEmail(email);
    if (!user) return void 0;
    const filtered = (user.savedAddresses || []).filter((a) => a.id !== addressId);
    if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
      filtered[0].isDefault = true;
    }
    return this.updateUser(email, { savedAddresses: filtered });
  }
  /**
   * Sets default delivery address
   */
  static setDefaultAddress(email, addressId) {
    const user = this.getUserByEmail(email);
    if (!user) return void 0;
    const updated = (user.savedAddresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId
    }));
    return this.updateUser(email, { savedAddresses: updated });
  }
  /**
   * Session Management: Creates a secure token session (valid for 7 days)
   */
  static createSession(profile) {
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3).toISOString();
    const session = {
      token,
      email: profile.email,
      userId: profile.uid,
      role: profile.role,
      name: profile.fullName,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      expiresAt
    };
    sessionsCache.set(token, session);
    return session;
  }
  /**
   * Validates an active session token
   */
  static getSession(token) {
    if (!token) return null;
    const session = sessionsCache.get(token);
    if (!session) return null;
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      sessionsCache.delete(token);
      return null;
    }
    return session;
  }
  /**
   * Revokes a session token (Logout)
   */
  static revokeSession(token) {
    if (token) {
      sessionsCache.delete(token);
    }
  }
  /**
   * Returns all users (for diagnostics / admin)
   */
  static getAllUsers() {
    return Array.from(usersCache.values()).map((r) => r.profile);
  }
};

// src/server/reservationsStore.ts
import fs3 from "node:fs";
import path3 from "node:path";
import os3 from "node:os";
var BATCH_CAPACITIES = {
  "batch-01": { totalAllocations: 85, name: "BABA BUDAN OBSIDIAN" },
  "batch-02": { totalAllocations: 60, name: "MALABAR MONSOONED CASK" },
  "batch-03": { totalAllocations: 75, name: "SHEVAROY ELEVATION 1600" },
  "batch-04": { totalAllocations: 50, name: "WAYANAD WILD ROBUSTA" }
};
function getReservationsFilePath() {
  try {
    const localDir = path3.resolve(process.cwd(), "data");
    if (!fs3.existsSync(localDir)) {
      fs3.mkdirSync(localDir, { recursive: true });
    }
    return path3.join(localDir, "reservations.json");
  } catch {
    const tmpDir = path3.join(os3.tmpdir(), "noir-roast-data");
    try {
      if (!fs3.existsSync(tmpDir)) {
        fs3.mkdirSync(tmpDir, { recursive: true });
      }
    } catch {
    }
    return path3.join(tmpDir, "reservations.json");
  }
}
var reservationsCache = /* @__PURE__ */ new Map();
function loadReservationsFromDisk() {
  try {
    const filePath = getReservationsFilePath();
    if (fs3.existsSync(filePath)) {
      const raw = fs3.readFileSync(filePath, "utf-8");
      if (raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          reservationsCache = new Map(parsed.map((r) => [r.id, r]));
        }
      }
    }
  } catch (err) {
    console.warn("Reservations storage read notice (in-memory active):", err);
  }
}
function persistReservationsToDisk() {
  try {
    const filePath = getReservationsFilePath();
    const list = Array.from(reservationsCache.values());
    fs3.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("Reservations persistence notice (in-memory active):", err);
  }
}
loadReservationsFromDisk();
var ReservationsStore = class {
  static getRemainingAllocations(batchId) {
    const batch = BATCH_CAPACITIES[batchId] || { totalAllocations: 85, name: "BABA BUDAN OBSIDIAN" };
    let reserved = 0;
    for (const res of reservationsCache.values()) {
      if (res.batchId === batchId && res.status === "confirmed") {
        reserved += res.quantity;
      }
    }
    return Math.max(0, batch.totalAllocations - reserved);
  }
  static createReservation(data) {
    const batch = BATCH_CAPACITIES[data.batchId] || {
      totalAllocations: 85,
      name: data.batchId.toUpperCase()
    };
    const remaining = this.getRemainingAllocations(data.batchId);
    const safeQty = Math.max(1, Math.min(10, Math.floor(data.quantity)));
    const status = remaining >= safeQty ? "confirmed" : "waitlist";
    const cleanBatch = data.batchId.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const id = `res_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const certificateId = `NR-RES-2026-${cleanBatch}-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const reservation = {
      id,
      certificateId,
      batchId: data.batchId,
      batchName: batch.name,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      quantity: safeQty,
      grind: data.grind,
      status,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    reservationsCache.set(id, reservation);
    persistReservationsToDisk();
    return {
      success: true,
      reservation
    };
  }
  static getReservationById(id) {
    return reservationsCache.get(id) || null;
  }
  static getReservationsByEmail(email) {
    const clean = email.trim().toLowerCase();
    const results = [];
    for (const res of reservationsCache.values()) {
      if (res.email === clean) {
        results.push(res);
      }
    }
    return results;
  }
};

// src/server/newsletterStore.ts
import fs4 from "node:fs";
import path4 from "node:path";
import os4 from "node:os";
function getSubscribersFilePath() {
  try {
    const localDir = path4.resolve(process.cwd(), "data");
    if (!fs4.existsSync(localDir)) {
      fs4.mkdirSync(localDir, { recursive: true });
    }
    return path4.join(localDir, "subscribers.json");
  } catch {
    const tmpDir = path4.join(os4.tmpdir(), "noir-roast-data");
    try {
      if (!fs4.existsSync(tmpDir)) {
        fs4.mkdirSync(tmpDir, { recursive: true });
      }
    } catch {
    }
    return path4.join(tmpDir, "subscribers.json");
  }
}
var subscribersCache = /* @__PURE__ */ new Map();
function loadSubscribersFromDisk() {
  try {
    const filePath = getSubscribersFilePath();
    if (fs4.existsSync(filePath)) {
      const raw = fs4.readFileSync(filePath, "utf-8");
      if (raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          subscribersCache = new Map(parsed.map((s) => [s.email.toLowerCase(), s]));
        }
      }
    }
  } catch (err) {
    console.warn("Subscribers storage read notice (in-memory active):", err);
  }
}
function persistSubscribersToDisk() {
  try {
    const filePath = getSubscribersFilePath();
    const list = Array.from(subscribersCache.values());
    fs4.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("Subscribers persistence notice (in-memory active):", err);
  }
}
loadSubscribersFromDisk();
var NewsletterStore = class {
  static isSubscribed(email) {
    const clean = email.trim().toLowerCase();
    const existing = subscribersCache.get(clean);
    return Boolean(existing && existing.status === "active");
  }
  static subscribe(email, source = "footer") {
    const clean = email.trim().toLowerCase();
    const existing = subscribersCache.get(clean);
    if (existing && existing.status === "active") {
      return { success: true, alreadySubscribed: true };
    }
    const subscriber = {
      email: clean,
      source,
      subscribedAt: (/* @__PURE__ */ new Date()).toISOString(),
      status: "active"
    };
    subscribersCache.set(clean, subscriber);
    persistSubscribersToDisk();
    return { success: true, alreadySubscribed: false };
  }
  static unsubscribe(email) {
    const clean = email.trim().toLowerCase();
    const existing = subscribersCache.get(clean);
    if (existing) {
      existing.status = "unsubscribed";
      persistSubscribersToDisk();
      return true;
    }
    return false;
  }
  static getAllSubscribers() {
    return Array.from(subscribersCache.values());
  }
};

// src/server/razorpayClient.ts
import crypto2 from "node:crypto";
import Razorpay from "razorpay";
function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  return { keyId, keySecret, webhookSecret };
}
var razorpayInstance = null;
function getRazorpayClient() {
  const { keyId, keySecret } = getRazorpayCredentials();
  if (!keyId || !keySecret) {
    throw new Error("Razorpay initialization error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured on the server.");
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }
  return razorpayInstance;
}
async function createRazorpayOrder(amountInPaise, receipt, notes = {}) {
  const client = getRazorpayClient();
  const options = {
    amount: Math.round(amountInPaise),
    currency: "INR",
    receipt: receipt.substring(0, 40),
    payment_capture: 1,
    // Auto-capture payments
    notes
  };
  const order = await client.orders.create(options);
  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    receipt: order.receipt || receipt,
    status: order.status
  };
}
function verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return false;
  }
  const { keySecret } = getRazorpayCredentials();
  if (!keySecret) return false;
  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto2.createHmac("sha256", keySecret).update(payload).digest("hex");
  const expectedBuf = Buffer.from(expectedSignature, "utf-8");
  const actualBuf = Buffer.from(razorpaySignature, "utf-8");
  if (expectedBuf.length !== actualBuf.length) {
    return false;
  }
  return crypto2.timingSafeEqual(expectedBuf, actualBuf);
}
function verifyWebhookSignature(rawBody, signature, secretOverride) {
  if (!rawBody || !signature) return false;
  const { webhookSecret } = getRazorpayCredentials();
  const secret = secretOverride || webhookSecret;
  if (!secret) return false;
  try {
    const rawString = Buffer.isBuffer(rawBody) ? rawBody.toString("utf-8") : rawBody;
    const expectedSignature = crypto2.createHmac("sha256", secret).update(rawString).digest("hex");
    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    const actualBuf = Buffer.from(signature, "utf-8");
    if (expectedBuf.length !== actualBuf.length) {
      return false;
    }
    return crypto2.timingSafeEqual(expectedBuf, actualBuf);
  } catch {
    return false;
  }
}
async function fetchPaymentDetails(paymentId) {
  const client = getRazorpayClient();
  return client.payments.fetch(paymentId);
}

// src/types/payment.ts
var CUSTOM_UPI_QR_OPTIONS = [
  {
    id: "qr-noir-roastery",
    title: "PhonePe & All UPI (Primary)",
    accountHolder: "PRIYANSHU BIPIN SINGH",
    bankName: "PhonePe / Yes Bank",
    vpa: "7977641125@ybl",
    image: "/assets/qr/qr-phonepe.png",
    badge: "Popular \u2022 All UPI Apps",
    description: "Instant settlement via PhonePe, Google Pay, Paytm, or any UPI app to 7977641125@ybl.",
    isRecommended: true
  },
  {
    id: "qr-founder-kaapi",
    title: "Paytm UPI (Verified)",
    accountHolder: "PRIYANSHU BIPIN SINGH",
    bankName: "Paytm Payments Bank",
    vpa: "7977641125@ptyes",
    image: "/assets/qr/qr-paytm.png",
    badge: "Paytm Verified",
    description: "Direct verified Paytm payment to Priyanshu Bipin Singh (7977641125@ptyes)."
  },
  {
    id: "qr-estate-reserve",
    title: "BHIM / Google Pay UPI",
    accountHolder: "PRIYANSHU BIPIN SINGH",
    bankName: "BHIM / NPCI UPI",
    vpa: "7977641125@upi",
    image: "/assets/qr/qr-bhim-upi.png",
    badge: "Universal UPI",
    description: "Universal UPI QR code supported across Google Pay, CRED, and all Indian banking apps."
  }
];

// src/utils/inventorySystem.ts
var STORAGE_KEY = "noir_inventory_registry_v2";
var IMS_SESSION_KEY = "noir_ims_auth_session_v1";
var AUTHORIZED_IMS_ACCOUNTS = [
  {
    email: "admin@noirdakshin.com",
    password: "Noir@Admin2026",
    name: "Master Roaster Administrator",
    role: "ADMIN"
  },
  {
    email: "ims.engineer@noirdakshin.com",
    password: "Noir@Engine2026",
    name: "Lead IMS Systems Engineer",
    role: "IMS_ENGINEER"
  },
  {
    email: "priyanshubipin2006@gmail.com",
    password: "Noir@Admin2026",
    name: "Priyanshu Singh (Owner & Admin)",
    role: "ADMIN"
  }
];
var INITIAL_INVENTORY_RECORD = {
  "prod-01": 14,
  // Baba Budan Obsidian
  "prod-02": 8,
  // Malabar Monsooned Shore
  "prod-03": 6,
  // Araku Valley Tribal Honey
  "prod-04": 9,
  // Coorg Rainforest Peaberry
  "prod-05": 3,
  // Dakshin Reserve 1998 (Low Stock Showcase)
  "prod-06": 7,
  // Shevaroy Cloud Forest Light
  "prod-07": 2,
  // Nilgiri Blue Mountain Geisha (Ultra-rare allocation)
  "prod-08": 5,
  // Biligiri Rangan Wild Arabica
  "prod-09": 11,
  // Anamalai Highlands Dark Cacao
  "prod-10": 10,
  // Wayanad Robusta Royale
  "prod-11": 8,
  // Kodagu Wild Spice Cinnamon
  "prod-12": 12
  // Chikmagalur Elephant Monsooned AA
};
var getActiveIMSSession = () => {
  try {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(IMS_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role === "ADMIN" || parsed?.role === "IMS_ENGINEER") {
          return parsed;
        }
      }
    }
  } catch {
    return null;
  }
  return null;
};
var InventoryManager = class {
  inventory = {};
  listeners = /* @__PURE__ */ new Set();
  constructor() {
    this.loadInventory();
  }
  loadInventory() {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === "object") {
            this.inventory = { ...INITIAL_INVENTORY_RECORD, ...parsed };
            return;
          }
        }
      }
    } catch (e) {
      console.warn("Inventory loading failed, falling back to defaults", e);
    }
    this.inventory = { ...INITIAL_INVENTORY_RECORD };
  }
  saveInventory() {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inventory));
      }
    } catch (e) {
      console.error("Failed to persist inventory state", e);
    }
    this.notify();
  }
  subscribe(callback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
  notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error("Inventory subscriber error", err);
      }
    });
  }
  /**
   * Public Read: Anyone can view stock levels
   */
  getStock(productId) {
    if (!productId || typeof productId !== "string" || !Object.prototype.hasOwnProperty.call(this.inventory, productId)) {
      return 0;
    }
    const stock = this.inventory[productId];
    return typeof stock === "number" && Number.isFinite(stock) && stock >= 0 ? stock : 0;
  }
  /**
   * Public Read: Anyone can view stock status
   */
  getStockStatus(productId) {
    const stock = this.getStock(productId);
    if (stock <= 0) return "OUT_OF_STOCK";
    if (stock <= 3) return "LOW_STOCK";
    return "IN_STOCK";
  }
  /**
   * Public Read: Verifies if a user can add a lot to their cart
   */
  checkAvailability(productId, currentCartQty = 0, requestedQty = 1) {
    const stock = this.getStock(productId);
    const maxAddable = Math.max(0, stock - currentCartQty);
    const status = this.getStockStatus(productId);
    if (stock <= 0) {
      return {
        available: false,
        currentStock: 0,
        maxAddable: 0,
        status: "OUT_OF_STOCK",
        message: "This micro-lot is currently out of stock."
      };
    }
    if (requestedQty > maxAddable) {
      return {
        available: false,
        currentStock: stock,
        maxAddable,
        status,
        message: maxAddable === 0 ? `You have already added all ${stock} available units to your cart.` : `Only ${maxAddable} additional units can be added to your cart.`
      };
    }
    return {
      available: true,
      currentStock: stock,
      maxAddable,
      status
    };
  }
  /**
   * Atomic commit during customer checkout.
   */
  commitOrder(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return { success: false, error: "Cannot commit an empty order." };
    }
    const validItems = items.filter(
      (i) => i && typeof i.productId === "string" && Number.isFinite(i.quantity) && i.quantity > 0
    );
    if (validItems.length === 0) {
      return { success: false, error: "Order must contain at least one item with valid quantity." };
    }
    for (const item of validItems) {
      if (!Object.prototype.hasOwnProperty.call(this.inventory, item.productId)) {
        return {
          success: false,
          error: `Inventory error: Invalid or unrecognized lot ID "${item.productId}".`
        };
      }
      const stock = this.getStock(item.productId);
      if (stock < item.quantity) {
        return {
          success: false,
          error: `Inventory error: Insufficient stock for lot ID ${item.productId}. Required: ${item.quantity}, Available: ${stock}.`
        };
      }
    }
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
  verifyIMSAuthorization(session) {
    const active = session || getActiveIMSSession();
    if (!active || active.role !== "ADMIN" && active.role !== "IMS_ENGINEER") {
      throw new Error("Access Denied: Stock management is strictly restricted to Admin and IMS Engineer roles only.");
    }
  }
  /**
   * IMS ONLY: Restock a micro-lot
   */
  restock(productId, quantity, session) {
    this.verifyIMSAuthorization(session);
    if (!productId || typeof productId !== "string" || !Object.prototype.hasOwnProperty.call(this.inventory, productId)) {
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
  setStockDirect(productId, quantity, session) {
    this.verifyIMSAuthorization(session);
    if (!productId || typeof productId !== "string" || !Object.prototype.hasOwnProperty.call(this.inventory, productId)) {
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
  resetAllToDefault(session) {
    const active = session || getActiveIMSSession();
    if (!active || active.role !== "ADMIN") {
      throw new Error("Access Denied: Factory inventory reset requires Admin role authorization.");
    }
    this.inventory = { ...INITIAL_INVENTORY_RECORD };
    this.saveInventory();
  }
  /**
   * Internal/Test reset without session check (for test harness beforeEach)
   */
  _internalResetForTests() {
    this.inventory = { ...INITIAL_INVENTORY_RECORD };
    this.saveInventory();
  }
  getAllStock() {
    return { ...this.inventory };
  }
};
var inventorySystem = new InventoryManager();

// src/utils/validation.ts
var hasMaliciousContent = (value) => {
  if (!value || typeof value !== "string") return false;
  const maliciousPattern = /[<>]|<[^>]*>?|javascript:|data:|vbscript:|on\w+\s*=|script|iframe|embed|object|__proto__|constructor\s*\(|prototype\b/i;
  return maliciousPattern.test(value);
};
var stripDangerousMarkup = (value) => {
  if (!value || typeof value !== "string") return "";
  return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "").replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "").replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "").replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "").replace(/<[^>]*>?/gm, "").replace(/[<>]/g, "").replace(/javascript:/gi, "").replace(/data:/gi, "").replace(/vbscript:/gi, "").replace(/on\w+\s*=/gi, "");
};
var sanitizeName = (value, allowTrailingSpace = false) => {
  const clean = stripDangerousMarkup(value);
  const filtered = clean.replace(/[^A-Za-z\s]/g, "").replace(/\s{2,}/g, " ");
  return allowTrailingSpace ? filtered.replace(/^\s+/, "") : filtered.trim();
};
var isValidName = (value) => {
  if (!value || value.trim().length < 2) return false;
  if (hasMaliciousContent(value)) return false;
  return /^[A-Za-z\s]{2,60}$/.test(value.trim());
};
var sanitizePhone = (value) => {
  const clean = stripDangerousMarkup(value);
  return clean.replace(/[^0-9+\s()-]/g, "");
};
var isValidPhone = (value) => {
  if (!value || typeof value !== "string") return false;
  const digitsOnly = value.replace(/\D/g, "");
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};
var sanitizeAddress = (value) => {
  const clean = stripDangerousMarkup(value);
  return clean.replace(/[^A-Za-z0-9\s,.\-#/]/g, "");
};
var sanitizeCity = (value) => {
  const clean = stripDangerousMarkup(value);
  return clean.replace(/[^A-Za-z\s.'-]/g, "");
};
var sanitizeCountry = (value) => {
  const clean = stripDangerousMarkup(value);
  return clean.replace(/[^A-Za-z\s'-]/g, "");
};
var sanitizePostalCode = (value) => {
  const clean = stripDangerousMarkup(value);
  return clean.replace(/[^A-Za-z0-9\s-]/g, "");
};
var isValidEmail = (email) => {
  if (!email || email.trim().length === 0) return false;
  if (hasMaliciousContent(email)) return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
};
var sanitizeText = (value) => {
  return stripDangerousMarkup(value).trim();
};

// src/server/app.ts
dotenv.config();
var app = express();
app.disable("x-powered-by");
var HASHED_IMS_ACCOUNTS = AUTHORIZED_IMS_ACCOUNTS.map((acc) => {
  const { salt, hash } = hashPassword(acc.password);
  return {
    email: acc.email.toLowerCase(),
    name: acc.name,
    role: acc.role,
    salt,
    hash
  };
});
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
app.use(cors());
function containsPrototypePollution(obj) {
  if (!obj || typeof obj !== "object") return false;
  for (const key of Object.keys(obj)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return true;
    }
    const val = obj[key];
    if (typeof val === "object" && val !== null) {
      if (containsPrototypePollution(val)) return true;
    }
  }
  return false;
}
app.use((req, res, next) => {
  if (containsPrototypePollution(req.body) || containsPrototypePollution(req.query) || containsPrototypePollution(req.params)) {
    res.status(400).json({ success: false, error: "Malformed request: prohibited property keys detected." });
    return;
  }
  next();
});
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: true }));
var apiRouter = express.Router();
apiRouter.get("/", (_req, res) => {
  const { keyId } = getRazorpayCredentials();
  res.json({
    status: "ok",
    service: "Noir Roast Coffee Payment Gateway",
    razorpayConfigured: Boolean(keyId),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
apiRouter.get("/health", (_req, res) => {
  const { keyId } = getRazorpayCredentials();
  res.json({
    status: "ok",
    service: "Noir Roast Coffee Payment Gateway",
    razorpayConfigured: Boolean(keyId),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
apiRouter.get("/payment/config", (_req, res) => {
  const { keyId } = getRazorpayCredentials();
  res.json({
    keyId: keyId || process.env.VITE_RAZORPAY_KEY_ID || "",
    currency: "INR",
    merchantName: "NOIR ROAST COFFEE",
    customQrOptions: CUSTOM_UPI_QR_OPTIONS
  });
});
apiRouter.post("/payment/create-order", async (req, res) => {
  try {
    const { items, customer, discountCode, paymentMethod, customQrId } = req.body;
    if (!customer || typeof customer !== "object") {
      res.status(400).json({ success: false, error: "Customer details are required." });
      return;
    }
    const fullName = customer.fullName?.trim() || "";
    const email = customer.email?.trim() || "";
    const phone = customer.phone?.trim() || "";
    const address = customer.address?.trim() || "";
    const city = customer.city?.trim() || "Bengaluru";
    const postalCode = customer.postalCode?.trim() || "560038";
    const country = customer.country?.trim() || "India";
    if (!isValidName(fullName)) {
      res.status(400).json({ success: false, error: "Valid customer name is required (alphabets only)." });
      return;
    }
    if (!isValidEmail(email)) {
      res.status(400).json({ success: false, error: "Valid customer email is required." });
      return;
    }
    if (!isValidPhone(phone)) {
      res.status(400).json({ success: false, error: "Valid phone number is required (min 7 digits)." });
      return;
    }
    if (address.length < 5) {
      res.status(400).json({ success: false, error: "Complete delivery address is required." });
      return;
    }
    const validPaymentMethod = ["razorpay", "cod", "custom_upi_qr"].includes(paymentMethod) ? paymentMethod : "razorpay";
    const valuation = calculateAuthoritativeValuation(items, discountCode, validPaymentMethod);
    if (!valuation.isValid) {
      res.status(400).json({ success: false, error: valuation.error || "Invalid cart valuation." });
      return;
    }
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const orderNumber = `NR-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const newOrder = {
      id: orderId,
      orderNumber,
      customerId: customer.memberId || void 0,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: {
        fullName,
        email,
        phone,
        address: sanitizeAddress(address),
        city: sanitizeCity(city),
        postalCode: sanitizePostalCode(postalCode),
        country: sanitizeCountry(country)
      },
      items: valuation.items,
      pricing: valuation.pricing,
      paymentMethod: validPaymentMethod,
      paymentStatus: validPaymentMethod === "custom_upi_qr" ? "awaiting_manual_verification" : "pending",
      customQrId: validPaymentMethod === "custom_upi_qr" ? customQrId : void 0,
      fulfillmentStatus: "unfulfilled",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (validPaymentMethod === "razorpay") {
      const { keyId, keySecret } = getRazorpayCredentials();
      if (!keyId || !keySecret) {
        res.status(500).json({
          success: false,
          error: "Razorpay credentials are not configured on the server. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel Project Settings > Environment Variables."
        });
        return;
      }
      try {
        const rzpOrder = await createRazorpayOrder(
          valuation.pricing.amountInPaise,
          orderNumber,
          { internalOrderId: orderId, customerEmail: email }
        );
        newOrder.razorpayOrderId = rzpOrder.id;
        OrdersStore.saveOrder(newOrder);
        res.json({
          success: true,
          orderId,
          orderNumber,
          paymentMethod: "razorpay",
          amount: valuation.pricing.amountInPaise,
          currency: "INR",
          razorpayOrderId: rzpOrder.id,
          keyId,
          order: newOrder
        });
        return;
      } catch (err) {
        console.error("Razorpay order creation error:", err);
        const errMsg = err instanceof Error ? err.message : "Failed to communicate with Razorpay gateway.";
        res.status(502).json({
          success: false,
          error: `Razorpay Gateway Error: ${errMsg}`
        });
        return;
      }
    }
    if (validPaymentMethod === "cod") {
      newOrder.paymentStatus = "pending";
      newOrder.fulfillmentStatus = "unfulfilled";
      OrdersStore.saveOrder(newOrder);
      inventorySystem.commitOrder(
        valuation.items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity
        }))
      );
      res.json({
        success: true,
        orderId,
        orderNumber,
        paymentMethod: "cod",
        paymentStatus: "pending",
        order: newOrder
      });
      return;
    }
    if (validPaymentMethod === "custom_upi_qr") {
      newOrder.paymentStatus = "awaiting_manual_verification";
      newOrder.customQrId = customQrId || "qr-noir-roastery";
      newOrder.adminVerification = {
        status: "pending"
      };
      OrdersStore.saveOrder(newOrder);
      inventorySystem.commitOrder(
        valuation.items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity
        }))
      );
      res.json({
        success: true,
        orderId,
        orderNumber,
        paymentMethod: "custom_upi_qr",
        paymentStatus: "awaiting_manual_verification",
        customQrId: newOrder.customQrId,
        order: newOrder
      });
      return;
    }
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: "Internal server error creating order." });
  }
});
apiRouter.post("/payment/verify-signature", async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        error: "Missing required Razorpay verification parameters."
      });
      return;
    }
    const order = OrdersStore.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found in database." });
      return;
    }
    if (order.razorpayOrderId !== razorpay_order_id) {
      res.status(403).json({
        success: false,
        error: "Security Mismatch: Provided Razorpay order ID does not match server record."
      });
      return;
    }
    const isSignatureValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    if (!isSignatureValid) {
      res.status(400).json({
        success: false,
        error: "Cryptographic Verification Failed: Invalid payment signature."
      });
      return;
    }
    let paymentDetails;
    try {
      paymentDetails = await fetchPaymentDetails(razorpay_payment_id);
    } catch (err) {
      console.warn("Could not fetch payment from Razorpay API, proceeding with signature check:", err);
    }
    if (paymentDetails) {
      const expectedPaise = order.pricing.amountInPaise;
      const actualPaise = Number(paymentDetails.amount);
      if (actualPaise < expectedPaise) {
        res.status(400).json({
          success: false,
          error: `Payment amount mismatch: Expected \u20B9${order.pricing.finalTotal}, got \u20B9${actualPaise / 100}.`
        });
        return;
      }
      if (paymentDetails.status !== "captured" && paymentDetails.status !== "authorized") {
        res.status(400).json({
          success: false,
          error: `Payment is not in captured status (Current status: ${paymentDetails.status}).`
        });
        return;
      }
    }
    const updated = OrdersStore.updateOrderPayment(orderId, {
      paymentStatus: "captured",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      fulfillmentStatus: "roasting"
    });
    inventorySystem.commitOrder(
      order.items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity
      }))
    );
    res.json({
      success: true,
      message: "Payment verified successfully.",
      order: updated
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, error: "Internal server error verifying signature." });
  }
});
apiRouter.post("/payment/submit-utr", (req, res) => {
  try {
    const { orderId, utrNumber, customQrId } = req.body;
    if (!orderId || typeof orderId !== "string") {
      res.status(400).json({ success: false, error: "Order ID is required." });
      return;
    }
    if (!utrNumber || typeof utrNumber !== "string") {
      res.status(400).json({ success: false, error: "12-digit UPI UTR or Reference Number is required." });
      return;
    }
    const cleanUtr = utrNumber.replace(/[^A-Za-z0-9]/g, "").trim();
    if (cleanUtr.length < 6 || cleanUtr.length > 25) {
      res.status(400).json({
        success: false,
        error: "Please enter a valid UPI Reference / UTR Number (6-22 characters)."
      });
      return;
    }
    const order = OrdersStore.getOrderById(orderId);
    if (!order) {
      res.status(404).json({ success: false, error: "Order not found." });
      return;
    }
    const updated = OrdersStore.updateOrderPayment(orderId, {
      paymentStatus: "awaiting_manual_verification",
      utrNumber: cleanUtr,
      customQrId: customQrId || order.customQrId || "qr-noir-roastery",
      adminVerification: {
        status: "pending",
        adminNotes: "Customer submitted UTR reference. Awaiting bank statement reconciliation."
      }
    });
    res.json({
      success: true,
      message: "UTR reference recorded. Order is awaiting manual verification by roastery finance.",
      order: updated
    });
  } catch (error) {
    console.error("Error submitting UTR:", error);
    res.status(500).json({ success: false, error: "Failed to record UTR reference." });
  }
});
apiRouter.post("/payment/webhook", (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"] || "";
    const rawBody = req.rawBody;
    if (!rawBody || !signature) {
      res.status(400).json({ status: "error", error: "Missing raw body or webhook signature." });
      return;
    }
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn("Razorpay Webhook signature verification failed.");
      res.status(400).json({ status: "error", error: "Invalid webhook signature." });
      return;
    }
    const event = req.body;
    const eventType = event.event;
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentPayload = event.payload?.payment?.entity;
      const orderPayload = event.payload?.order?.entity;
      const rzpOrderId = paymentPayload?.order_id || orderPayload?.id;
      const rzpPaymentId = paymentPayload?.id;
      if (rzpOrderId) {
        const order = OrdersStore.getOrderByRazorpayOrderId(rzpOrderId);
        if (order) {
          if (order.paymentStatus !== "captured") {
            OrdersStore.updateOrderPayment(order.id, {
              paymentStatus: "captured",
              razorpayPaymentId: rzpPaymentId,
              fulfillmentStatus: "roasting"
            });
            inventorySystem.commitOrder(
              order.items.map((it) => ({
                productId: it.productId,
                quantity: it.quantity
              }))
            );
          }
        }
      }
    } else if (eventType === "payment.failed") {
      const paymentPayload = event.payload?.payment?.entity;
      const rzpOrderId = paymentPayload?.order_id;
      if (rzpOrderId) {
        const order = OrdersStore.getOrderByRazorpayOrderId(rzpOrderId);
        if (order && order.paymentStatus !== "captured") {
          OrdersStore.updateOrderPayment(order.id, {
            paymentStatus: "failed"
          });
        }
      }
    }
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ status: "error", error: "Webhook processing failed." });
  }
});
apiRouter.get("/orders/my-orders", (req, res) => {
  const email = req.query.email || "";
  const memberId = req.query.memberId || "";
  const phone = req.query.phone || "";
  if (!email && !memberId && !phone) {
    res.status(400).json({ success: false, error: "Customer identifier (email, phone, or memberId) is required." });
    return;
  }
  const orders = OrdersStore.getCustomerOrders(email || memberId, phone);
  res.json({ success: true, count: orders.length, orders });
});
apiRouter.get("/orders/:orderId", (req, res) => {
  const orderId = String(req.params.orderId || "");
  const order = OrdersStore.getOrderById(orderId) || OrdersStore.getOrderByNumber(orderId);
  if (!order) {
    res.status(404).json({ success: false, error: "Order not found." });
    return;
  }
  res.json({ success: true, order });
});
function checkAdminAccess(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const adminKey = req.headers["x-admin-key"] || "";
  const candidate = token || adminKey;
  const validSecret = process.env.ADMIN_SECRET || process.env.ADMIN_API_KEY || "Noir@Admin2026";
  if (candidate && candidate === validSecret) {
    return { isAuthorized: true, operatorName: "Master Roaster Administrator" };
  }
  if (candidate) {
    const session = UsersStore.getSession(candidate);
    if (session && (session.role === "ADMIN" || session.role === "IMS_ENGINEER")) {
      return { isAuthorized: true, operatorName: session.name };
    }
  }
  return { isAuthorized: false, error: "Access denied: Valid Administrator or IMS Engineer credentials required." };
}
apiRouter.get("/admin/orders", (req, res) => {
  const auth = checkAdminAccess(req);
  if (!auth.isAuthorized) {
    res.status(403).json({ success: false, error: auth.error });
    return;
  }
  const orders = OrdersStore.getAllOrders();
  res.json({ success: true, count: orders.length, orders });
});
apiRouter.post("/admin/verify-utr", (req, res) => {
  const auth = checkAdminAccess(req);
  if (!auth.isAuthorized) {
    res.status(403).json({ success: false, error: auth.error });
    return;
  }
  const { orderId, isApproved, verifiedBy, notes } = req.body;
  if (!orderId) {
    res.status(400).json({ success: false, error: "Order ID is required." });
    return;
  }
  const updated = OrdersStore.verifyUtr(
    orderId,
    verifiedBy || auth.operatorName || "Admin Roaster",
    Boolean(isApproved),
    notes
  );
  if (!updated) {
    res.status(404).json({ success: false, error: "Order not found." });
    return;
  }
  res.json({ success: true, message: "Order verification updated.", order: updated });
});
apiRouter.post("/auth/register", (req, res) => {
  try {
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "unknown_ip";
    const rateCheck = checkRateLimit(`reg_${clientIp}`, 5, 15 * 60 * 1e3);
    if (!rateCheck.allowed) {
      res.status(429).json({
        success: false,
        error: `Too many registration attempts. Please try again in ${rateCheck.retryAfterSeconds} seconds.`
      });
      return;
    }
    const { fullName, email, phone, password } = req.body;
    if (typeof fullName !== "string" || typeof email !== "string" || typeof phone !== "string" || typeof password !== "string") {
      res.status(400).json({ success: false, error: "All fields are required." });
      return;
    }
    if (hasMaliciousContent(fullName) || hasMaliciousContent(email) || hasMaliciousContent(phone) || hasMaliciousContent(password)) {
      res.status(400).json({ success: false, error: "Input contains prohibited characters or markup." });
      return;
    }
    const cleanName = sanitizeName(fullName);
    if (!cleanName || !isValidName(cleanName) || cleanName.length > 60) {
      res.status(400).json({ success: false, error: "Valid full name (alphabets only, min 2 chars) is required." });
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !isValidEmail(cleanEmail) || cleanEmail.length > 254) {
      res.status(400).json({ success: false, error: "Valid email address is required." });
      return;
    }
    const cleanPhone = sanitizePhone(phone);
    if (!cleanPhone || !isValidPhone(cleanPhone) || cleanPhone.length > 20) {
      res.status(400).json({ success: false, error: "Valid phone number (min 7 digits) is required." });
      return;
    }
    if (password.length < 6 || password.length > 128) {
      res.status(400).json({ success: false, error: "Password must be between 6 and 128 characters." });
      return;
    }
    const existing = UsersStore.getUserByEmail(cleanEmail);
    if (existing) {
      res.status(409).json({
        success: false,
        error: "An account with this email address already exists. Please sign in instead."
      });
      return;
    }
    const { salt, hash } = hashPassword(password);
    const memberId = `NR-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const newProfile = {
      uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      memberId,
      fullName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: "CUSTOMER",
      authProvider: "password",
      savedAddresses: [],
      preferences: {
        favoriteGrind: "Whole Bean",
        newsletter: true,
        cuppingAlerts: true
      },
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = UsersStore.saveUserWithCredentials(newProfile, salt, hash);
    const session = UsersStore.createSession(saved);
    res.status(201).json({
      success: true,
      message: "Account created successfully. Welcome to Noir Roast Coffee.",
      profile: saved,
      session: {
        name: saved.fullName,
        email: saved.email,
        phone: saved.phone,
        memberId: saved.memberId,
        isLoggedIn: true,
        role: saved.role,
        savedAddresses: saved.savedAddresses,
        token: session.token
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, error: "Failed to complete registration." });
  }
});
apiRouter.post("/auth/login", (req, res) => {
  try {
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip || "unknown_ip";
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ success: false, error: "Invalid email or password format." });
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    const rateCheck = checkLoginRateLimit(clientIp, cleanEmail);
    if (!rateCheck.allowed) {
      res.status(429).json({
        success: false,
        error: rateCheck.error || "Too many sign-in attempts. Please try again later."
      });
      return;
    }
    if (!cleanEmail || !isValidEmail(cleanEmail) || cleanEmail.length > 254) {
      res.status(400).json({ success: false, error: "Please enter a valid email address." });
      return;
    }
    if (!password || password.length < 1 || password.length > 128) {
      res.status(400).json({ success: false, error: "Please enter your password." });
      return;
    }
    if (hasMaliciousContent(cleanEmail) || hasMaliciousContent(password)) {
      res.status(400).json({ success: false, error: "Input contains prohibited characters or markup." });
      return;
    }
    const imsRecord = HASHED_IMS_ACCOUNTS.find((a) => a.email === cleanEmail);
    if (imsRecord) {
      const isMatch = verifyPassword(password, imsRecord.salt, imsRecord.hash);
      if (isMatch) {
        resetLoginRateLimit(clientIp, cleanEmail);
        const imsProfile = {
          uid: `ims_${imsRecord.role.toLowerCase()}`,
          memberId: imsRecord.role === "ADMIN" ? "NOIR-OWNER-01" : "NOIR-ENG-02",
          fullName: imsRecord.name,
          email: imsRecord.email,
          phone: "+91 79776 41125",
          role: imsRecord.role,
          authProvider: "password",
          savedAddresses: [],
          preferences: {
            favoriteGrind: "South Indian Brass Filter Kaapi",
            newsletter: true,
            cuppingAlerts: true
          },
          createdAt: "1998-01-01T00:00:00.000Z",
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        const session = UsersStore.createSession(imsProfile);
        res.json({
          success: true,
          message: "Signed in successfully.",
          profile: imsProfile,
          session: {
            name: imsProfile.fullName,
            email: imsProfile.email,
            phone: imsProfile.phone,
            memberId: imsProfile.memberId,
            isLoggedIn: true,
            role: imsProfile.role,
            savedAddresses: imsProfile.savedAddresses,
            token: session.token
          }
        });
        return;
      }
    }
    const record = UsersStore.getUserRecord(cleanEmail);
    if (record && record.passwordSalt && record.passwordHash) {
      const isMatch = verifyPassword(password, record.passwordSalt, record.passwordHash);
      if (isMatch) {
        resetLoginRateLimit(clientIp, cleanEmail);
        const session = UsersStore.createSession(record.profile);
        res.json({
          success: true,
          message: "Signed in successfully.",
          profile: record.profile,
          session: {
            name: record.profile.fullName,
            email: record.profile.email,
            phone: record.profile.phone,
            memberId: record.profile.memberId,
            isLoggedIn: true,
            role: record.profile.role,
            savedAddresses: record.profile.savedAddresses,
            token: session.token
          }
        });
        return;
      }
    }
    performDummyPasswordVerification(password);
    res.status(401).json({
      success: false,
      error: "Invalid email or password."
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "An unexpected authentication error occurred." });
  }
});
apiRouter.post("/auth/logout", (req, res) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "") || req.body?.token;
  if (token) {
    UsersStore.revokeSession(token);
  }
  res.json({ success: true, message: "Logged out successfully." });
});
apiRouter.post("/reservations", (req, res) => {
  try {
    const { batchId, fullName, email, grind, quantity } = req.body;
    if (!fullName || !isValidName(fullName)) {
      res.status(400).json({ success: false, error: "Valid patron name (alphabets only) is required." });
      return;
    }
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ success: false, error: "Valid email address is required." });
      return;
    }
    const result = ReservationsStore.createReservation({
      batchId: batchId || "batch-01",
      fullName,
      email,
      grind: grind || "whole",
      quantity: Number(quantity) || 1
    });
    res.json(result);
  } catch (err) {
    console.error("Reservation error:", err);
    res.status(500).json({ success: false, error: "Failed to process allocation reservation." });
  }
});
apiRouter.get("/reservations/remaining/:batchId", (req, res) => {
  const batchId = String(req.params.batchId || "batch-01");
  const remaining = ReservationsStore.getRemainingAllocations(batchId);
  res.json({ success: true, batchId, remaining });
});
apiRouter.post("/newsletter/subscribe", (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ success: false, error: "Please enter a valid email address." });
      return;
    }
    const result = NewsletterStore.subscribe(email, source || "footer");
    if (result.alreadySubscribed) {
      res.json({
        success: true,
        alreadySubscribed: true,
        message: "You are already subscribed to Noir Roast roastery dispatches."
      });
      return;
    }
    res.status(201).json({
      success: true,
      message: "Subscribed! Welcome to Noir Roast roastery dispatches."
    });
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    res.status(500).json({ success: false, error: "Failed to complete newsletter subscription." });
  }
});
apiRouter.post("/auth/sync", (req, res) => {
  try {
    const { uid, email, fullName, phone, authProvider } = req.body;
    if (!email && !phone) {
      res.status(400).json({ success: false, error: "Email or phone number is required to sync account." });
      return;
    }
    const cleanEmail = (email || `${phone}@phone.noirkaapi.in`).trim().toLowerCase();
    let existing = UsersStore.getUserByEmail(cleanEmail) || (uid ? UsersStore.getUserById(uid) : void 0);
    if (existing) {
      const updated = UsersStore.updateUser(existing.email, {
        fullName: fullName || existing.fullName,
        phone: phone || existing.phone,
        authProvider: authProvider || existing.authProvider
      });
      const profile = updated || existing;
      const session2 = UsersStore.createSession(profile);
      res.json({
        success: true,
        profile,
        session: {
          name: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          memberId: profile.memberId,
          isLoggedIn: true,
          role: profile.role,
          savedAddresses: profile.savedAddresses,
          token: session2.token
        }
      });
      return;
    }
    const memberId = `NR-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const isPhoneVal = (str) => Boolean(str && (str.startsWith("+") || /^\d+$/.test(str.replace(/[\s+]/g, ""))));
    const resolvedName = fullName && !isPhoneVal(fullName) ? fullName.trim() : "";
    const newProfile = {
      uid: uid || `usr_${Date.now()}`,
      memberId,
      fullName: resolvedName,
      email: cleanEmail,
      phone: phone || "",
      role: "CUSTOMER",
      authProvider: authProvider || "google",
      savedAddresses: [],
      preferences: {
        favoriteGrind: "Whole Bean",
        newsletter: true,
        cuppingAlerts: true
      },
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = UsersStore.saveUser(newProfile);
    const session = UsersStore.createSession(saved);
    res.json({
      success: true,
      profile: saved,
      session: {
        name: saved.fullName,
        email: saved.email,
        phone: saved.phone,
        memberId: saved.memberId,
        isLoggedIn: true,
        role: saved.role,
        savedAddresses: saved.savedAddresses,
        token: session.token
      }
    });
  } catch (err) {
    console.error("Session sync error:", err);
    res.status(500).json({ success: false, error: "Session synchronization failed." });
  }
});
apiRouter.get("/auth/profile", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  let user;
  if (token) {
    const session = UsersStore.getSession(token);
    if (session) {
      user = UsersStore.getUserByEmail(session.email) || UsersStore.getUserById(session.userId);
    }
  }
  if (!user) {
    const email = req.query.email || "";
    const memberId = req.query.memberId || "";
    if (email && isValidEmail(email)) {
      user = UsersStore.getUserByEmail(email);
    } else if (memberId) {
      user = UsersStore.getUserById(memberId);
    }
  }
  if (!user) {
    res.status(404).json({ success: false, error: "Customer profile not found." });
    return;
  }
  res.json({ success: true, profile: user });
});
apiRouter.post("/auth/update-profile", (req, res) => {
  try {
    const { email, fullName, phone, preferences } = req.body;
    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      res.status(400).json({ success: false, error: "Valid customer email is required." });
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token) {
      const session = UsersStore.getSession(token);
      if (session && session.email.toLowerCase() !== cleanEmail && session.role !== "ADMIN" && session.role !== "IMS_ENGINEER") {
        res.status(403).json({ success: false, error: "Unauthorized to update this profile." });
        return;
      }
    }
    if (hasMaliciousContent(fullName) || hasMaliciousContent(phone)) {
      res.status(400).json({ success: false, error: "Input contains prohibited characters or markup." });
      return;
    }
    const updates = {};
    if (fullName && typeof fullName === "string") {
      const cleanName = sanitizeName(fullName);
      if (isValidName(cleanName)) updates.fullName = cleanName;
    }
    if (phone && typeof phone === "string") {
      const cleanPhone = sanitizePhone(phone);
      if (isValidPhone(cleanPhone)) updates.phone = cleanPhone;
    }
    if (preferences && typeof preferences === "object" && !Array.isArray(preferences)) {
      updates.preferences = preferences;
    }
    let updated = UsersStore.updateUser(cleanEmail, updates);
    if (!updated) {
      const memberId = `NR-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
      const newProfile = {
        uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        memberId,
        fullName: updates.fullName || "User",
        email: cleanEmail,
        phone: updates.phone || (cleanEmail.includes("@phone") ? cleanEmail.split("@")[0] : ""),
        role: "CUSTOMER",
        authProvider: "phone",
        savedAddresses: [],
        preferences: updates.preferences || {
          favoriteGrind: "Whole Bean",
          newsletter: true,
          cuppingAlerts: true
        },
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      updated = UsersStore.saveUser(newProfile);
    }
    res.json({ success: true, profile: updated });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ success: false, error: "Failed to update customer profile." });
  }
});
apiRouter.post("/auth/address", (req, res) => {
  try {
    const { email, address } = req.body;
    if (!email || typeof email !== "string" || !isValidEmail(email) || !address || typeof address !== "object") {
      res.status(400).json({ success: false, error: "Valid email and address details are required." });
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token) {
      const session = UsersStore.getSession(token);
      if (session && session.email.toLowerCase() !== cleanEmail && session.role !== "ADMIN" && session.role !== "IMS_ENGINEER") {
        res.status(403).json({ success: false, error: "Unauthorized to modify addresses for this profile." });
        return;
      }
    }
    if (hasMaliciousContent(address.label) || hasMaliciousContent(address.fullName) || hasMaliciousContent(address.phone) || hasMaliciousContent(address.street || address.address) || hasMaliciousContent(address.city) || hasMaliciousContent(address.postalCode) || hasMaliciousContent(address.country)) {
      res.status(400).json({ success: false, error: "Input contains prohibited characters or markup." });
      return;
    }
    const newAddr = {
      id: address.id || `addr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: sanitizeText(address.label || "Delivery Address").slice(0, 40),
      fullName: sanitizeName(address.fullName || "Customer").slice(0, 60),
      phone: sanitizePhone(address.phone || "").slice(0, 20),
      street: sanitizeAddress(address.street || address.address || "").slice(0, 200),
      city: sanitizeCity(address.city || "Bengaluru").slice(0, 80),
      postalCode: sanitizePostalCode(address.postalCode || "560038").slice(0, 12),
      country: sanitizeCountry(address.country || "India").slice(0, 60),
      isDefault: Boolean(address.isDefault)
    };
    let updated = UsersStore.addAddress(cleanEmail, newAddr);
    if (!updated) {
      const memberId = `NR-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
      const newProfile = {
        uid: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        memberId,
        fullName: newAddr.fullName || "Customer",
        email: cleanEmail,
        phone: newAddr.phone || (cleanEmail.includes("@phone") ? cleanEmail.split("@")[0] : ""),
        role: "CUSTOMER",
        authProvider: "phone",
        savedAddresses: [newAddr],
        preferences: {
          favoriteGrind: "Whole Bean",
          newsletter: true,
          cuppingAlerts: true
        },
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      updated = UsersStore.saveUser(newProfile);
    }
    res.json({ success: true, message: "Address saved.", profile: updated });
  } catch (err) {
    console.error("Address creation error:", err);
    res.status(500).json({ success: false, error: "Failed to save address." });
  }
});
apiRouter.delete("/auth/address/:addressId", (req, res) => {
  try {
    const email = req.query.email || req.body?.email || "";
    const addressId = String(req.params.addressId || "");
    if (!email || !addressId || !isValidEmail(email)) {
      res.status(400).json({ success: false, error: "Valid email and address ID are required." });
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (token) {
      const session = UsersStore.getSession(token);
      if (session && session.email.toLowerCase() !== cleanEmail && session.role !== "ADMIN" && session.role !== "IMS_ENGINEER") {
        res.status(403).json({ success: false, error: "Unauthorized to modify addresses for this profile." });
        return;
      }
    }
    const updated = UsersStore.deleteAddress(cleanEmail, addressId);
    if (!updated) {
      res.status(404).json({ success: false, error: "Customer profile not found." });
      return;
    }
    res.json({ success: true, message: "Address removed.", profile: updated });
  } catch (err) {
    console.error("Address deletion error:", err);
    res.status(500).json({ success: false, error: "Failed to delete address." });
  }
});
apiRouter.post("/email/dispatch", async (req, res) => {
  try {
    const clientIp = req.ip || req.headers["x-forwarded-for"] || "client";
    const rateCheck = checkRateLimit(`email_${clientIp}`, 10, 60 * 1e3);
    if (!rateCheck.allowed) {
      res.status(429).json({
        success: false,
        error: `Too many email dispatch requests. Please retry in ${rateCheck.retryAfterSeconds} seconds.`
      });
      return;
    }
    const { toEmail, subject, recipientName, message, orderNumber, total, itemsList, address } = req.body;
    if (!toEmail || !isValidEmail(toEmail)) {
      res.status(400).json({ success: false, error: "Valid recipient email is required." });
      return;
    }
    const emailPayload = {
      _subject: subject || `Order Telemetry Notification #${orderNumber || "UPDATE"} \u2022 NOIR ROAST`,
      _template: "box",
      _captcha: "false",
      Recipient_Name: recipientName || "Valued Patron",
      Recipient_Email: toEmail,
      Order_Number: orderNumber || "N/A",
      Order_Items: itemsList || "N/A",
      Total_Amount: total || "N/A",
      Delivery_Address: address || "N/A",
      Roastery_Message: message || "Fresh single-estate beans queued for roasting.",
      Heritage: "NOIR ROAST COFFEE ROASTERS \u2022 CHIKMAGALUR & BENGALURU"
    };
    fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(emailPayload)
    }).catch((err) => {
      console.warn("Server direct email dispatch to recipient error:", err);
    });
    if (toEmail.toLowerCase() !== "priyanshubipin2006@gmail.com") {
      fetch("https://formsubmit.co/ajax/priyanshubipin2006@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          ...emailPayload,
          _subject: `[ROASTERY DISPATCH COPY] ${emailPayload._subject}`
        })
      }).catch((err) => {
        console.warn("Server copy to roastery owner error:", err);
      });
    }
    res.json({
      success: true,
      delivered: true,
      recipient: toEmail,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Email dispatch relay error";
    res.status(500).json({ success: false, error: errMsg });
  }
});
app.use("/api", apiRouter);
app.use("/", apiRouter);
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "API endpoint not found" });
});
app.use((err, _req, res, _next) => {
  console.error("Unhandled API error:", err);
  res.status(500).json({
    success: false,
    error: "An unexpected internal error occurred. Please try again later."
  });
});

// src/server/entry.ts
function handler(req, res) {
  return app(req, res);
}
export {
  handler as default
};
