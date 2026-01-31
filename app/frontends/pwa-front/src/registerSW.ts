import { Workbox } from 'workbox-window';

export function registerSW() {
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');

    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        console.log('New content is available; please refresh.');
        // You can show a prompt to the user here
        if (confirm('New content is available! Click OK to refresh.')) {
          window.location.reload();
        }
      } else {
        console.log('Content is cached for offline use.');
      }
    });

    wb.addEventListener('waiting', () => {
      console.log('A new service worker has installed, but it is waiting to activate.');
    });

    wb.addEventListener('controlling', () => {
      console.log('Service worker is now controlling the page.');
    });

    wb.addEventListener('activated', (event) => {
      if (!event.isUpdate) {
        console.log('Service worker activated for the first time!');
      } else {
        console.log('Service worker activated after update!');
      }
    });

    wb.register()
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  } else {
    console.log('Service Worker is not supported in this browser.');
  }
}
