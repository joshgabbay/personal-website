import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // meet.jgabbay.com (and meet.localhost in dev) shows the booking page at its root.
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "meet\\.(jgabbay\\.com|localhost(:\\d+)?)" }],
          destination: "/meet",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
