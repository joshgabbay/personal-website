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
      // jgabbay.com/leads is the private leads dashboard. It runs as its own Vercel
      // project (jgabbay-leads) so its data and password stay out of this public repo.
      afterFiles: [
        { source: "/leads", destination: "https://jgabbay-leads.vercel.app/leads" },
        {
          source: "/leads/:path*",
          destination: "https://jgabbay-leads.vercel.app/leads/:path*",
        },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
