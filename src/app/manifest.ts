import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MyAnchor App",
    short_name: "MyAnchor",
    description:
      "MyAnchor helps you face fears with gentle, trackable exposures.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/logo.svg",
        sizes: "192x192",
        type: "image/svg",
      },
      {
        src: "/logo.svg",
        sizes: "512x512",
        type: "image/svg",
      },
    ],
  };
}
