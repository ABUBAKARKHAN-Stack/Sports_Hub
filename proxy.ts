import { withAuth } from "next-auth/middleware";
import { UserRoles } from "./types/main.types";

export default withAuth(
    function middleware(req) {
        const role = req.nextauth.token?.role;
        const pathname = req.nextUrl.pathname;

        const authPages = [
            "/signin",
            "/signup",
            "/forgot-password",
            "/reset-password",
        ];

        if (role && authPages.some((p) => pathname.startsWith(p))) {
            return Response.redirect(new URL("/", req.url));
        }

     
        if (role === UserRoles.USER) {
            if (pathname.startsWith("/admin") || pathname.startsWith("/super-admin")) {
                return Response.redirect(new URL("/", req.url));
            }
        }

        if (role === UserRoles.ADMIN) {
            if (pathname.startsWith("/super-admin")) {
                return Response.redirect(new URL("/", req.url));
            }
        }

        if (role === UserRoles.SUPER_ADMIN) {
            if (pathname.startsWith("/admin")) {
                return Response.redirect(new URL("/", req.url));
            }
        }

        return;
    },
    {
        callbacks: {
            authorized: ({ token }) => true,
        },
    }
);


export const config = {
    matcher: [
        "/admin/:path*",
        "/super-admin/:path*",
        "/signin",
        "/signup",
        "/forgot-password",
        "/reset-password",
    ],
};
