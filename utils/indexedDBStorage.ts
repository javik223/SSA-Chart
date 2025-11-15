/**
 * IndexedDB storage adapter for Zustand persist middleware
 * Provides better performance and larger storage capacity than localStorage/sessionStorage
 */

import { StateStorage } from 'zustand/middleware';

const DB_NAME = 'claude-charts-db';
const STORE_NAME = 'chart-store';
const DB_VERSION = 1;

/**
 * Opens or creates the IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not supported in this environment.'));
  }
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Get item from IndexedDB
 */
async function getItem(key: string): Promise<string | null> {
  if (typeof indexedDB === 'undefined') {
    return null;
  }
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        resolve(request.result ?? null);
      };

      request.onerror = () => {
        reject(new Error('Failed to get item from IndexedDB'));
      };
    });
  } catch (error) {
    console.error('IndexedDB getItem error:', error);
    return null;
  }
}

/**
 * Set item in IndexedDB
 */
async function setItem(key: string, value: string): Promise<void> {
  if (typeof indexedDB === 'undefined') {
    return;
  }
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to set item in IndexedDB'));
      };
    });
  } catch (error) {
    console.error('IndexedDB setItem error:', error);
  }
}

/**
 * Remove item from IndexedDB
 */
async function removeItem(key: string): Promise<void> {
  if (typeof indexedDB === 'undefined') {
    return;
  }
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to remove item from IndexedDB'));
      };
    });
  } catch (error) {
    console.error('IndexedDB removeItem error:', error);
  }
}

/**
 * Clear all items from the store
 */
export async function clearStore(): Promise<void> {
  if (typeof indexedDB === 'undefined') {
    return;
  }
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to clear IndexedDB store'));
      };
    });
  } catch (error) {
    console.error('IndexedDB clearStore error:', error);
  }
}

/**
 * Get all keys from the store
 */
export async function getAllKeys(): Promise<string[]> {
  if (typeof indexedDB === 'undefined') {
    return [];
  }
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAllKeys();

      request.onsuccess = () => {
        resolve(request.result as string[]);
      };

      request.onerror = () => {
        reject(new Error('Failed to get keys from IndexedDB'));
      };
    });
  } catch (error) {
    console.error('IndexedDB getAllKeys error:', error);
    return [];
  }
}

/**
 * IndexedDB storage adapter for Zustand
 * Compatible with the StateStorage interface
 */
export const indexedDBStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await removeItem(name);
  },
};
