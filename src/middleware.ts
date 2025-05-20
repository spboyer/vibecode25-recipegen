import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
  // Add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin') || '';
    const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL || '', 'http://localhost:3000'];
    
    const response = NextResponse.next();
    
    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
    
    return response;
  }
  
  return NextResponse.next();
}
 
export const config = {
  matcher: ['/api/:path*'],
};
