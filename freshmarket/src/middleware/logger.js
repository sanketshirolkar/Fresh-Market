// src/middleware/logger.js
export function logRequest(req) {
    // req is a NextRequest running on the Edge runtime
    const { method, nextUrl } = req;
    const ts = new Date().toISOString(); // ISO timestamp so it’s sortable
    const path = nextUrl?.pathname || '/';
    console.log(`[${ts}] ${method} ${path}`);
  }