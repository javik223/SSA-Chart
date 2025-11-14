/**
 * Custom hook to monitor IndexedDB storage usage and provide utilities
 */

import { useState, useEffect } from 'react';
import { clearStore, getAllKeys } from '@/utils/indexedDBStorage';

interface StorageInfo {
  usage: number;
  quota: number;
  percentUsed: number;
  available: number;
  isSupported: boolean;
}

export function useStorageInfo() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    usage: 0,
    quota: 0,
    percentUsed: 0,
    available: 0,
    isSupported: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkStorage = async () => {
    setIsLoading(true);

    // Check if Storage API is supported
    if (!navigator.storage || !navigator.storage.estimate) {
      setStorageInfo({
        usage: 0,
        quota: 0,
        percentUsed: 0,
        available: 0,
        isSupported: false,
      });
      setIsLoading(false);
      return;
    }

    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;
      const available = quota - usage;

      setStorageInfo({
        usage,
        quota,
        percentUsed,
        available,
        isSupported: true,
      });
    } catch (error) {
      console.error('Failed to estimate storage:', error);
      setStorageInfo({
        usage: 0,
        quota: 0,
        percentUsed: 0,
        available: 0,
        isSupported: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStorage();
  }, []);

  const clearAllData = async () => {
    try {
      await clearStore();
      await checkStorage(); // Refresh info after clearing
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  };

  const getStorageKeys = async () => {
    try {
      return await getAllKeys();
    } catch (error) {
      console.error('Failed to get storage keys:', error);
      return [];
    }
  };

  const requestPersistence = async () => {
    if (!navigator.storage || !navigator.storage.persist) {
      return false;
    }

    try {
      return await navigator.storage.persist();
    } catch (error) {
      console.error('Failed to request persistent storage:', error);
      return false;
    }
  };

  const checkPersistence = async () => {
    if (!navigator.storage || !navigator.storage.persisted) {
      return false;
    }

    try {
      return await navigator.storage.persisted();
    } catch (error) {
      console.error('Failed to check persistence:', error);
      return false;
    }
  };

  return {
    storageInfo,
    isLoading,
    clearAllData,
    getStorageKeys,
    requestPersistence,
    checkPersistence,
    refresh: checkStorage,
  };
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
