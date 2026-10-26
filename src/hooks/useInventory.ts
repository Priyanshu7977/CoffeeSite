import { useState, useEffect, useCallback } from 'react';
import { 
  inventorySystem, 
  authenticateIMS, 
  getActiveIMSSession, 
  logoutIMS,
  type StockStatus, 
  type InventoryCheckResult,
  type IMSUserSession 
} from '../utils/inventorySystem';

export function useInventory() {
  const [stockMap, setStockMap] = useState<Record<string, number>>(() => inventorySystem.getAllStock());
  const [imsSession, setImsSession] = useState<IMSUserSession | null>(() => getActiveIMSSession());

  useEffect(() => {
    const unsubscribe = inventorySystem.subscribe(() => {
      setStockMap(inventorySystem.getAllStock());
    });
    return unsubscribe;
  }, []);

  const loginAsIMS = useCallback((id: string, pass: string) => {
    const result = authenticateIMS(id, pass);
    if (result.success && result.session) {
      setImsSession(result.session);
    }
    return result;
  }, []);

  const logoutOfIMS = useCallback(() => {
    logoutIMS();
    setImsSession(null);
  }, []);

  const getStock = useCallback((productId: string): number => {
    return inventorySystem.getStock(productId);
  }, []);

  const getStockStatus = useCallback((productId: string): StockStatus => {
    return inventorySystem.getStockStatus(productId);
  }, []);

  const checkAvailability = useCallback(
    (productId: string, currentCartQty?: number, requestedQty?: number): InventoryCheckResult => {
      return inventorySystem.checkAvailability(productId, currentCartQty, requestedQty);
    },
    []
  );

  const commitOrder = useCallback((items: Array<{ productId: string; quantity: number }>) => {
    return inventorySystem.commitOrder(items);
  }, []);

  const restock = useCallback((productId: string, quantity: number = 5) => {
    return inventorySystem.restock(productId, quantity, imsSession);
  }, [imsSession]);

  const setStockDirect = useCallback((productId: string, quantity: number) => {
    return inventorySystem.setStockDirect(productId, quantity, imsSession);
  }, [imsSession]);

  const resetAllToDefault = useCallback(() => {
    inventorySystem.resetAllToDefault(imsSession);
  }, [imsSession]);

  return {
    stockMap,
    imsSession,
    loginAsIMS,
    logoutOfIMS,
    getStock,
    getStockStatus,
    checkAvailability,
    commitOrder,
    restock,
    setStockDirect,
    resetAllToDefault,
  };
}
