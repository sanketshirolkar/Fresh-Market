// src/middleware.js
import { NextResponse } from 'next/server';
import { logRequest } from './middleware/logger';

export function middleware(req) {
  logRequest(req);
  return NextResponse.next();
}

// Exclude static files & image optimizer; log everything else
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};