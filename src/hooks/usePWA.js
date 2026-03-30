import { useState, useEffect, useCallback } from 'react';

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [notifyPermission, setNotifyPermission] = useState(Notification.permission);
  const [memento, setMemento] = useState(null);

  useEffect(() => {
    // 1. Listen for Install Prompt
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('PWA: beforeinstallprompt triggered');
    };
    
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    
    // 2. Track successful install
    window.addEventListener('appinstalled', (evt) => {
      console.log('PWA: Application installed successfully');
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const handleInstallPWA = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: User choice outcome: ${outcome}`);
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      alert("Browser-ul tău nu suportă notificări native.");
      return;
    }
    const permission = await Notification.requestPermission();
    setNotifyPermission(permission);
  }, []);

  const sendNativeNotification = useCallback((title, body) => {
    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            body: body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            vibrate: [200, 100, 200],
            tag: 'skill-tracker-memento'
          });
        }).catch(() => {
          new Notification(title, { body });
        });
      } else {
        new Notification(title, { body });
      }
    }
  }, []);

  const showMemento = useCallback((title, message, type = 'info') => {
    const mementoId = Date.now();
    setMemento({ id: mementoId, title, message, type });
    sendNativeNotification(title, message);
    
    setTimeout(() => {
      setMemento(prev => (prev?.id === mementoId ? null : prev));
    }, 5000);
  }, [sendNativeNotification]);

  return {
    deferredPrompt,
    notifyPermission,
    memento,
    setMemento,
    handleInstallPWA,
    requestNotificationPermission,
    showMemento
  };
}
