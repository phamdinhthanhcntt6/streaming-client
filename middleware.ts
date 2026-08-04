import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Định nghĩa danh sách các trang CHỈ dành cho người CHƯA đăng nhập
const authRoutes = ["/login", "/register", "/forgot-password"];

// 2. Định nghĩa danh sách các trang BẮT BUỘC PHẢI đăng nhập
const protectedRoutes = ["/profile"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Lấy token từ Cookie
  const token = request.cookies.get("access_token")?.value;

  // KIỂM TRA 1: Đã login nhưng cố tình vào trang /login -> Đá về trang chủ '/'
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // KIỂM TRA 2: Chưa login nhưng cố tình vào trang bảo mật -> Đá về /login
  // Dùng .some() để chặn cả các sub-route như /settings/account
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // KIỂM TRA 3: Hợp lệ -> Cho phép request đi tiếp tới page.tsx
  return NextResponse.next();
}

// 3. Cấu hình Matcher (Cực kỳ quan trọng để tối ưu hiệu năng)
// Matcher chỉ định Middleware sẽ KHÔNG CHẠY khi user tải ảnh, file CSS, file tĩnh...
export const config = {
  matcher: [
    /*
     * Match tất cả các request paths ngoại trừ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
