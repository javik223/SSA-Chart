/**
 * Optional development panel for monitoring IndexedDB storage
 * Add this component to your app during development to debug storage
 *
 * Usage:
 * import { StorageDebugPanel } from '@/components/StorageDebugPanel';
 *
 * // Add to your layout (only in development)
 * {process.env.NODE_ENV === 'development' && <StorageDebugPanel />}
 */

'use client';

import { useState, useEffect } from 'react';
import { useStorageInfo, formatBytes } from '@/hooks/useStorageInfo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Database,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  HardDrive,
} from 'lucide-react';

export function StorageDebugPanel() {
  const {
    storageInfo,
    isLoading,
    clearAllData,
    getStorageKeys,
    requestPersistence,
    checkPersistence,
    refresh,
  } = useStorageInfo();

  const [keys, setKeys] = useState<string[]>([]);
  const [isPersisted, setIsPersisted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    loadKeys();
    checkPersisted();
  }, []);

  const loadKeys = async () => {
    const storageKeys = await getStorageKeys();
    setKeys(storageKeys);
  };

  const checkPersisted = async () => {
    const persisted = await checkPersistence();
    setIsPersisted(persisted);
  };

  const handleClear = async () => {
    if (
      confirm(
        'Are you sure you want to clear all stored data? This cannot be undone.'
      )
    ) {
      const success = await clearAllData();
      if (success) {
        alert('Storage cleared successfully!');
        await loadKeys();
        await refresh();
      } else {
        alert('Failed to clear storage. Check console for errors.');
      }
    }
  };

  const handleRequestPersistence = async () => {
    const granted = await requestPersistence();
    setIsPersisted(granted);
    alert(
      granted
        ? 'Persistent storage granted!'
        : 'Persistent storage denied or not supported'
    );
  };

  const handleRefresh = async () => {
    await refresh();
    await loadKeys();
    await checkPersisted();
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 z-50"
        title="Show Storage Debug Panel"
      >
        <Database className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="p-4 bg-white shadow-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-sm">Storage Debug Panel</h3>
          </div>
          <button
            onClick={() => setShowPanel(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Loading storage info...</p>
        ) : (
          <div className="space-y-4">
            {/* Storage Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <HardDrive className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Storage Usage</span>
              </div>

              {storageInfo.isSupported ? (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Used:</span>
                      <span className="font-mono">
                        {formatBytes(storageInfo.usage)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-mono">
                        {formatBytes(storageInfo.available)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Quota:</span>
                      <span className="font-mono">
                        {formatBytes(storageInfo.quota)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        storageInfo.percentUsed > 80
                          ? 'bg-red-600'
                          : storageInfo.percentUsed > 50
                          ? 'bg-yellow-600'
                          : 'bg-green-600'
                      }`}
                      style={{ width: `${storageInfo.percentUsed}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {storageInfo.percentUsed.toFixed(1)}% used
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-2 text-xs text-amber-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>Storage API not supported</span>
                </div>
              )}
            </div>

            {/* Persistence Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPersisted ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                  )}
                  <span className="text-sm font-medium">
                    {isPersisted ? 'Persistent' : 'Not Persistent'}
                  </span>
                </div>
                {!isPersisted && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRequestPersistence}
                    className="text-xs h-7"
                  >
                    Request
                  </Button>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {isPersisted
                  ? 'Data protected from automatic eviction'
                  : 'Data may be cleared under storage pressure'}
              </p>
            </div>

            {/* Storage Keys */}
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Stored Keys ({keys.length})
              </p>
              {keys.length > 0 ? (
                <div className="bg-gray-50 rounded p-2 max-h-32 overflow-y-auto">
                  {keys.map((key) => (
                    <div
                      key={key}
                      className="text-xs font-mono text-gray-700 truncate"
                    >
                      {key}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No keys stored</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefresh}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleClear}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              Development mode only
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
