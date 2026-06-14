import { useState, useEffect } from 'react';

/**
 * Custom hook to read and write values to localStorage.
 * Automatically handles JSON serialization and deserialization.
 * 
 * @param {string} key The localStorage key
 * @param {any} initialValue The fallback initial value if the key doesn't exist
 */
export function useLocalStorage(key, initialValue) {
  // Retrieve stored value or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      
      // Dispatch a custom event to sync with other instances of this hook (if any)
      window.dispatchEvent(new Event('local-storage-sync'));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Sync state across multiple components if they use the same hook
  useEffect(() => {
    const handleSync = () => {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (e) {
        console.warn('Sync failed:', e);
      }
    };

    window.addEventListener('local-storage-sync', handleSync);
    window.addEventListener('storage', handleSync); // Sync across tabs
    return () => {
      window.removeEventListener('local-storage-sync', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [key]);

  return [storedValue, setValue];
}
