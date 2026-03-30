import { useState, useEffect, useCallback } from 'react';

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [notifyPermission, setNotifyPermission] = useState(Notification.permission);
  const [memento, setMemento] = useState(null);

  useEffect(() => {
    // 1. Inject Manifest
    const manifest = {
      name: "Skill Tracker Pro",
      short_name: "SkillTracker",
      start_url: ".",
      display: "standalone",
      background_color: "#f9fafb",
      theme_color: "#4f46e5",
      icons: [{
        src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 24 24' fill='none' stroke='%234f46e5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 20h9'/><path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'/></svg>",
        sizes: "192x192",
        type: "image/svg+xml"
      }]
    };
    const manifestBlob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(manifestBlob);
    
    let link = document.querySelector('link[rel="manifest"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }
    link.href = manifestURL;

    // 2. Inject Service Worker for PWA installability and Push Notifications
    const swCode = `
      self.addEventListener('install', (e) => self.skipWaiting());
      self.addEventListener('activate', (e) => self.clients.claim());
      self.addEventListener('fetch', (e) => {});
      self.addEventListener('notificationclick', function(event) {
        event.notification.close();
        event.waitUntil(
          clients.matchAll({ type: 'window' }).then(windowClients => {
            if (windowClients.length > 0) {
              windowClients[0].focus();
            } else {
              clients.openWindow('/');
            }
          })
        );
      });
    `;
    const swBlob = new Blob([swCode], {type: 'application/javascript'});
    const swUrl = URL.createObjectURL(swBlob);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(swUrl).catch(() => {});
    }

    // 3. Listen for Install Prompt
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
  }, []);

  const handleInstallPWA = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
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
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          body: body,
          icon: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 24 24' fill='none' stroke='%234f46e5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 20h9'/><path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'/></svg>",
          vibrate: [200, 100, 200],
          tag: 'skill-tracker-memento',
          requireInteraction: true 
        });
      }).catch(err => {
        new Notification(title, { body: body, requireInteraction: true });
      });
    }
  }, []);

  const showMemento = useCallback((title, message, type = 'info') => {
    const mementoId = Date.now();
    setMemento({ id: mementoId, title, message, type });
    sendNativeNotification(title, message);
    
    // Auto-hide after 5 seconds
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
