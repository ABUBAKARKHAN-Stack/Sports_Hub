// middlewares/auth.ts - Updated version
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRoles } from '@/types/main.types';
import { ApiError } from '@/utils/ApiError';

export async function isAdmin(request: NextRequest): Promise<boolean> {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      return false;
    }

    const userRole = token.role as UserRoles;
    return userRole === UserRoles.ADMIN || userRole === UserRoles.SUPER_ADMIN;
  } catch (error) {
    console.error("Auth error:", error);
    return false;
  }
}


export function withAdmin(handler: (req: NextRequest,context?:any) => Promise<NextResponse>) {
  return async (req: NextRequest,context?:any) => {
    const hasAdminAccess = await isAdmin(req);
    
    if (!hasAdminAccess) {
      return NextResponse.json(
        new ApiError(403, "Access denied. Admin privileges required."),
        { status: 403 }
      );
    }

    return handler(req,context);
  };
}