export { auth as middleware } from "@/lib/auth";

// We protect everything except /auth/** and some static paths (handled inside authorized()).
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|json|txt|xml|woff|woff2|ttf|otf|mp3|mp4|webm)).*)",
  ],
};
