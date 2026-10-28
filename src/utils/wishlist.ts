import { useState, useEffect } from 'react';

const STORAGE_KEY = 'noir_wishlist_v1';
const EVENT_NAME = 'noir_wishlist_updated';

export const getWishlist = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const isWishlisted = (productId: string): boolean => {
  const list = getWishlist();
  return list.includes(productId);
};

export const toggleWishlist = (productId: string): boolean => {
  const current = getWishlist();
  let updated: string[];
  const wasPresent = current.includes(productId);

  if (wasPresent) {
    updated = current.filter((id) => id !== productId);
  } else {
    updated = [...current, productId];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { wishlist: updated, productId, added: !wasPresent } }));
  } catch (err) {
    console.warn('Failed to update wishlist:', err);
  }

  return !wasPresent;
};

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<string[]>(() => getWishlist());

  useEffect(() => {
    const handler = () => {
      setWishlist(getWishlist());
    };

    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return {
    wishlist,
    count: wishlist.length,
    isWishlisted: (id: string) => wishlist.includes(id),
    toggle: (id: string) => toggleWishlist(id),
  };
};
