import { NextRequest, NextResponse } from 'next/server'
import jwt from '@tsndr/cloudflare-worker-jwt'


export async function middleware(request: NextRequest) {
  const token:string = request.cookies.get('_token')
  
  if (!request.nextUrl.pathname.startsWith('/api/auth/logout')) {
    if(token&&!await jwt.verify(token, process.env.JWT_SECRET_KEY)) return NextResponse.redirect(new URL('/api/auth/logout', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/manage')||request.nextUrl.pathname.startsWith('/api/manage')) {
    if(!token) return NextResponse.redirect(new URL('/login', request.url))
    if(jwt.decode(token).payload.level!=='ADMIN' )return NextResponse.redirect(new URL('/', request.url))
  }
}