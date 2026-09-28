import os from 'os';

/**
 * Returns the IPv4 address of the host machine on the local network (e.g. 192.168.x.x or 10.x.x.x)
 */
export function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  
  // Prefer Wi-Fi or Ethernet interfaces over virtual/internal adapters
  const preferredNames = ['wi-fi', 'wifi', 'wlan', 'ethernet', 'eth'];
  
  // First pass: look for preferred interface names
  for (const preferred of preferredNames) {
    for (const name of Object.keys(interfaces)) {
      if (name.toLowerCase().includes(preferred)) {
        for (const iface of interfaces[name] || []) {
          if (iface.family === 'IPv4' && !iface.internal) {
            return iface.address;
          }
        }
      }
    }
  }

  // Second pass: any valid external IPv4
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return '127.0.0.1';
}
