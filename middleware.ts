import { NextRequest, NextResponse } from 'next/server'
import jwt from '@tsndr/cloudflare-worker-jwt'


export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/manage')||request.nextUrl.pathname.startsWith('/api/manage')) {
    const token:string = request.cookies.get('_token')
    if(!token) return NextResponse.redirect(new URL('/login', request.url))
    if(!await jwt.verify(token, process.env.JWT_SECRET_KEY)) return NextResponse.redirect(new URL('/api/auth/logout', request.url))
    if(jwt.decode(token).payload.level!=='ADMIN' )return NextResponse.redirect(new URL('/', request.url))
  }
}