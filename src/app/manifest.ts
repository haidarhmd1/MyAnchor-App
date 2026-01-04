import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyAnchor App",
    short_name: "MyAnchor",
    description:
      "MyAnchor helps you face fears with gentle, trackable exposures.",

    // Keep these root-based so it works regardless of locale routing
    start_url: "/",
    scope: "/",

    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",

    // Optional but helpful on Android launchers
    id: "/",
    orientation: "any",
    icons: [
      {
        src: "/icons/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
